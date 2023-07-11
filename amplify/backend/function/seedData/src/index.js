/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SALLYDBSHOPPINGCART_ARN
	STORAGE_SALLYDBSHOPPINGCART_NAME
	STORAGE_SALLYDBSHOPPINGCART_STREAMARN
	STORAGE_SALLYDB_ARN
	STORAGE_SALLYDB_NAME
	STORAGE_SALLYDB_STREAMARN
	STORAGE_SALLYORDERDB3_ARN
	STORAGE_SALLYORDERDB3_NAME
	STORAGE_SALLYORDERDB3_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-1" });
const now = new Date().toISOString();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { numProductsToCreate, numOrdersToCreate } = event;

  if (
    numProductsToCreate === null ||
    typeof numProductsToCreate === "undefined"
  ) {
    throw new Error("Need numProductsToCreate to create products");
  }

  if (numOrdersToCreate === null || typeof numOrdersToCreate === "undefined") {
    throw new Error("Need numOrdersToCreate to create orders");
  }

  const productScanResult = await docClient
    .scan({
      TableName: "products-main",
    })
    .promise();

  const allCurrentProducts = productScanResult.Items;

  console.log(`Retrieved ${allCurrentProducts.length} products`);

  const imageList = allCurrentProducts.map((p) => p.imageKey);

  console.log(`Creating ${numProductsToCreate} products`);

  const newProducts = [];

  for (let i = 0; i < numProductsToCreate; i++) {
    const randomImageKey =
      imageList[randomIntFromInterval(0, imageList.length - 1)];
    const randomNumber = randomIntFromInterval(1, 999999999);
    const randomQuantity = randomIntFromInterval(0, 1000);

    const putItem = {
      id: uuidv4(),
      name: `Product ${randomNumber}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      imageKey: randomImageKey,
      stockQuantity: randomQuantity,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await docClient
        .put({
          TableName: "products-main",
          Item: putItem,
        })
        .promise();

      newProducts.push(putItem);
    } catch (error) {
      console.log(`ERROR PUTTING PRODUCT: ${error}`);
      console.log(`PRODUCT: ${JSON.stringify(putItem)}`);
      throw error;
    }
  }

  const newProductList = [...allCurrentProducts, ...newProducts];

  console.log(`Creating ${numOrdersToCreate} new orders`);

  for (let i = 0; i < numOrdersToCreate; i++) {
    const numProducts = randomIntFromInterval(1, 5);
    const orderProducts = [];

    // get numProducts random products from the list
    for (let j = 0; j < numProducts; j++) {
      const randomProduct =
        newProductList[randomIntFromInterval(0, newProductList.length - 1)];

      // only insert the product if it isn't already in the list
      if (!orderProducts.find((op) => op.id === randomProduct.id)) {
        orderProducts.push(randomProduct);
      }
    }

    const putItem = {
      id: uuidv4(),
      name: "Jerry Smith",
      addressLine1: "123 Test St",
      addressLine2: "",
      city: "Test City",
      state: "CA",
      postalCode: "94591",
      status: "processing",
      userId: "6939098e-d021-7024-4b4d-d745855e7597",
      products: orderProducts,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await docClient
        .put({
          TableName: "order-main",
          Item: putItem,
        })
        .promise();
    } catch (error) {
      console.log(`ERROR PUTTING ORDER: ${error}`);
      console.log(`ORDER: ${JSON.stringify(putItem)}`);
      throw error;
    }
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify("SUCCESS!"),
  };
};

// from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
