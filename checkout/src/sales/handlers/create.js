const dynamodb = require("aws-sdk/clients/dynamodb");
const uuid = require("uuid/v4");
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;
exports.createSaleHandler = async event => {
  try {
    if (event.httpMethod !== "POST") {
      throw new Error(
        `createSale only accepts POST method, you tried: ${event.httpMethod} method.`
      );
    }

    const body = JSON.parse(event.body);
    body.id = uuid();
    const Item = Object.assign({}, body);

    var params = {
      TableName: tableName,
      Item
    };

    const { requestContext } = event;
    const Location = !!requestContext
      ? `https://${requestContext.domainName}${requestContext.path}/${body.id}`
      : body.id;
    const result = await docClient.put(params).promise();
    const response = {
      statusCode: 201,
      headers: {
        Location,
        "Access-Control-Allow-Origin": "*"
      }
    };
    return response;
  } catch (error) {
    return error;
  }
};
