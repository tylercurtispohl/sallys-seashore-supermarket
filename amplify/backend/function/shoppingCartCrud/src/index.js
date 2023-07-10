/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SALLYDB_ARN
	STORAGE_SALLYDB_NAME
	STORAGE_SALLYDB_STREAMARN
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
    case "PUT":
      const body = JSON.parse(event.body);

      const result = await putShoppingCart(body);

      return {
        ...partialResponse,
        body: JSON.stringify(result),
      };
    case "GET":
    default:
      const { userId } = event.queryStringParameters;

      if (!userId) {
        throw new Error("Cannot retrieve cart - user ID not provided");
      }

      const data = await docClient
        .query({
          TableName: "shoppingCart-main",
          IndexName: "userId-index",
          KeyConditionExpression: "userId = :usrId",
          ExpressionAttributeValues: {
            ":usrId": userId,
          },
        })
        .promise();

      return {
        ...partialResponse,
        body: JSON.stringify(data),
      };
  }
};

const putShoppingCart = async (shoppingCartData) => {
  const putItem = {
    ...shoppingCartData,
    id: shoppingCartData.id || uuidv4(),
  };

  console.log(`PUTTING SHOPPING CART: ${JSON.stringify(putItem)}`);

  try {
    await docClient
      .put({
        TableName: "shoppingCart-main",
        Item: putItem,
      })
      .promise();

    // return the new or updated item
    return putItem;
  } catch (error) {
    console.log(`ERROR PUTTING SHOPPING CART: ${error}`);
    throw error;
  }
};
