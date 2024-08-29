const {
    DynamoDBClient,
    DescribeTableCommand,
    CreateTableCommand,
  } = require("@aws-sdk/client-dynamodb");
  const REGION = "ap-southeast-1";
  const TABLE_NAME = "MySampleTable";
  
  const ddbClient = new DynamoDBClient({ region: REGION });
  
  async function CheckOrCreateTable() {
    try {
      // Gọi hàm async và chờ kết quả
      await ddbClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      console.log("Table already exists");
    } catch (err) {
      if (err.name === "ResourceNotFoundException") {
        const createParams = {
          TableName: TABLE_NAME,
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        };
        await ddbClient.send(new CreateTableCommand(createParams));
        console.log("Table is created");
      } else {
        console.error("Unexpected error:", err); // Thêm dấu ":" để định dạng đẹp hơn
        throw err;
      }
    }
  }
  
  async function main() {
    console.log("inside main method...");
    await CheckOrCreateTable();
  }
  
  main();