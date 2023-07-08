/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SALLYDB_ARN
	STORAGE_SALLYDB_NAME
	STORAGE_SALLYDB_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  
  switch(event.httpMethod) {
    case("POST"): 
        const body = JSON.parse(event.body);
        const newItem = {
            ...body,
            id: uuidv4()
        }

        console.log(`NEW PRODUCT: ${JSON.stringify(newItem)}`);

        docClient.put({
            TableName: "products-main",
            Item: newItem
        });

        return {
            statusCode: 200,
            headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify(newItem),
        };
    case("GET"):
    default:
        return {
            statusCode: 200,
            headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify("Hello from Lambda!"),
        };
  }
  
  
};
