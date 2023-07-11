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
    case "DELETE":
      return await deleteProduct(event);
    case "POST":
    case "PUT":
      const body = JSON.parse(event.body);

      const result = await putProduct(body);

      return {
        ...partialResponse,
        body: JSON.stringify(result),
      };
    case "GET":
    default:
      let data;

      if (event.pathParameters?.proxy) {
        // assuming that proxy is a product ID
        // I know this is not a great idea but its what I'm going with for now
        data = await docClient
          .get({
            TableName: "products-main",
            Key: { id: event.pathParameters.proxy },
          })
          .promise();
      } else if (event.multiValueQueryStringParameters?.ids) {
        // get a list of products specified in the query string
        const ids = event.multiValueQueryStringParameters.ids;

        const result = await docClient
          .batchGet({
            RequestItems: {
              "products-main": {
                Keys: ids.map((id) => ({
                  id,
                })),
              },
            },
          })
          .promise();

        // transform the response to have a similar structure to the scan or get response
        data = {
          Items: result.Responses["products-main"],
        };
      } else {
        // check query string parameters for limit and lastEvaluatedKey
        // make them undefined if queryStringParameters is null
        const limit = event.queryStringParameters?.limit ?? undefined;
        const lastEvaluatedId =
          event.queryStringParameters?.lastEvaluatedId ?? undefined;

        data = await docClient
          .scan({
            TableName: "products-main",
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedId
              ? { id: lastEvaluatedId }
              : undefined,
          })
          .promise();
        console.log(`RETRIEVED DATA: ${JSON.stringify(data)}`);
      }

      return {
        ...partialResponse,
        body: JSON.stringify(data),
      };
  }
};

const deleteProduct = async (event) => {
  if (!event.pathParameters?.proxy) {
    return {
      ...partialResponse,
      statusCode: 400,
      body: "Product ID not provided!",
    };
  }

  await docClient
    .delete({
      TableName: "products-main",
      key: { id: event.pathParameters.proxy },
    })
    .promise();

  return {
    ...partialResponse,
    statusCode: 204,
  };
};

const putProduct = async (productData) => {
  const now = new Date().toISOString();

  const putItem = {
    ...productData,
    id: productData.id || uuidv4(),
    createdAt: productData.createdAt ?? now,
    updatedAt: now,
  };

  console.log(`PUTTING PRODUCT: ${JSON.stringify(putItem)}`);

  try {
    await docClient
      .put({
        TableName: "products-main",
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
