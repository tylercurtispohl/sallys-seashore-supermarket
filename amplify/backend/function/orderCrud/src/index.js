/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SALLYDBSHOPPINGCART_ARN
	STORAGE_SALLYDBSHOPPINGCART_NAME
	STORAGE_SALLYDBSHOPPINGCART_STREAMARN
	STORAGE_SALLYDB_ARN
	STORAGE_SALLYDB_NAME
	STORAGE_SALLYDB_STREAMARN
	STORAGE_SALLYORDERDB_ARN
	STORAGE_SALLYORDERDB_NAME
	STORAGE_SALLYORDERDB_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-1" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const partialResponse = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
  };

  switch (event.httpMethod) {
    case "POST":
      const placeOrderResult = await placeOrder(event);

      return {
        ...partialResponse,
        body: JSON.stringify(placeOrderResult),
      };
    case "PUT":
      const updateOrderResult = await updateOrder(event);

      return {
        ...partialResponse,
        body: JSON.stringify(updateOrderResult),
      };
    case "GET":
    default:
      const userId = event.queryStringParameters?.userId;
      const proxy = event.pathParameters?.proxy;

      let data;

      if (proxy) {
        // assuming that proxy is an order ID
        // again, I know this is not a great pattern but I did not have time to figure
        // out the API gateway routing to create a proper /orders/{id} endpoint
        data = await docClient
          .get({
            TableName: "orders-main",
            Key: { id: proxy },
          })
          .promise();
      } else if (userId) {
        // get all orders for the specified user
        data = await docClient
          .query({
            TableName: "orders-main",
            IndexName: "userId-index",
            KeyConditionExpression: "userId = :usrId",
            ExpressionAttributeValues: {
              ":usrId": userId,
            },
          })
          .promise();
      } else {
        // get all orders
        // TODO: improve performance by implementing pagination and avoiding a full table scan
        data = await docClient.scan({ TableName: "orders-main" }).promise();
      }

      return {
        ...partialResponse,
        body: JSON.stringify(data),
      };
  }
};

const placeOrder = async (event) => {
  // create the order
  // update stock quantity of all products in the order
  // delete the shopping cart record
  // return the created order

  const orderData = JSON.parse(event.body);
  const now = new Date().toISOString();

  const putItem = {
    ...orderData,
    id: orderData.id || uuidv4(),
    createdAt: now,
    updatedAt: now,
    status: "processing",
  };

  console.log(`PUTTING ORDER: ${JSON.stringify(putItem)}`);

  try {
    // first, create the order
    await docClient
      .put({
        TableName: "orders-main",
        Item: putItem,
      })
      .promise();

    const { products: orderProducts, shoppingCartId } = orderData;

    // get all the products from the order - we already have the product
    // data but we want to make sure that we update the quantity with the
    // latest product data in mind
    const productQueryResult = await docClient
      .batchGet({
        RequestItems: {
          "products-main": {
            Keys: orderProducts.map((p) => ({
              id: p.id,
            })),
          },
        },
      })
      .promise();

    const products = productQueryResult.Responses["products-main"];

    // update the stock quantity on all the products
    await docClient
      .batchWrite({
        RequestItems: {
          "products-main": products.map((p) => ({
            PutRequest: {
              Item: {
                ...p,
                // This assumes a user can only order one
                // of each item in the cart. This may need
                // to change later.
                stockQuantity: p.stockQuantity - 1,
                updatedAt: now,
              },
            },
          })),
        },
      })
      .promise();

    // Finally, delete the user's cart so they can start fresh.
    // We may want to update this to "archive" the cart instead
    // in case something goes wrong and we need to see what was
    // in the user's cart previously or restore their cart.
    await docClient
      .delete({
        TableName: "shoppingCart-main",
        Key: {
          id: shoppingCartId,
        },
      })
      .promise();

    return putItem;
  } catch (error) {
    console.log(`ERROR PUTTING PRODUCT: ${error}`);
    throw error;
  }
};

const updateOrder = async (event) => {
  const orderData = JSON.parse(event.body);

  const putItem = {
    ...orderData,
    id: orderData.id || uuidv4(),
    updatedAt: new Date().toISOString(),
  };

  console.log(`PUTTING ORDER: ${JSON.stringify(putItem)}`);

  try {
    await docClient
      .put({
        TableName: "orders-main",
        Item: putItem,
      })
      .promise();

    // return the new or updated item
    return putItem;
  } catch (error) {
    console.log(`ERROR PUTTING PRODUCT: ${error}`);
    throw error;
  }
};
