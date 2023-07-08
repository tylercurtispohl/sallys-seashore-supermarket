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

      const result = await putProduct(body);

      return {
        ...partialResponse,
        body: JSON.stringify(result),
      };
    case "GET":
    default:
      // TODO: improve performance by implementing pagination and avoiding a full table scan
      const data = await docClient
        .scan({ TableName: "products-main" })
        .promise();
      return {
        ...partialResponse,
        body: JSON.stringify(data),
      };
  }
};

const putProduct = async (productData) => {
  const putItem = {
    ...productData,
    id: productData.id || uuidv4(),
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
