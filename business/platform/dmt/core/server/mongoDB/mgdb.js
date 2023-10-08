/**
 * 数据库连接工具类。mongodb的3.*版本使用下面的方法。
 * TODO：1、数据库的并发空值：按照文档说，MongoDB的写入操作是原子操作。
 * 2、数据库的事务控制：mongodb不支持事务，所以，在你的项目中应用时，要注意这点。无论什么设计，都不要要求mongodb保证数据的完整性。
 * 但是mongodb提供了许多原子操作，比如文档的保存，修改，删除等，都是原子操作
 */
class mongodbObj {
  constructor() {
    this.MongoClient = require("mongodb").MongoClient;
    // Connection this.url
    this.url = "mongodb://localhost:27017/";
    // Database Name
    this.dbName = "dmtMgDb";
  }
  /**
   * 中台的数据库初始化操作，一般包括新建数据库，建表,插入预制数据等。
   */
  initDMTDB() {
    //table name
    const tableProduct = "product";
    // Use connect method to connect to the server
    this.MongoClient.connect(this.url + this.dbName, function (err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");
      const db = client.db(this.dbName);

      const collection1 = db.collection(tableProduct);
      onsole.log("Connected successfully to table" + collection1);

      client.close();
    });
  };
  /**
   * 给某张表插入一些数据 TODO：后续修改为promise，不使用callback
   */
  insertData(tableName, inData, callback) {
    this.MongoClient.connect(this.url + this.dbName, function (err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");
      const db = client.db(this.dbName);

      const collection = db.collection(tableName);
      // Insert some documents
      collection.insertMany(inData, function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
      });

      client.close();
    });
  };
  /**
   * 查询数据 TODO：后续修改为promise，不使用callback
   */
  findData(tableName, queryParam={}, callback) {
    this.MongoClient.connect(this.url + this.dbName, function (err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");
      const db = client.db(this.dbName);

      const collection = db.collection(tableName);
      // Find some documents
      collection.find(queryParam).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
      });

      client.close();
    });
  };
  /**
   * 更新数据 TODO：后续修改为promise，不使用callback
   */
  updateData(tableName, inData, callback) {
    this.MongoClient.connect(this.url + this.dbName, function (err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");
      const db = client.db(this.dbName);

      const collection = db.collection(tableName);
      // Update document where a is 2, set b equal to 1
      //{ a: 2 }, { $set: { b: 1 } }
      collection.updateOne(inData, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
      });

      client.close();
    });
  };
  /**
   * 删除数据 TODO：后续修改为promise，不使用callback
   */
  removeData(tableName, inData, callback) {
    this.MongoClient.connect(this.url + this.dbName, function (err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");
      const db = client.db(this.dbName);

      const collection = db.collection(tableName);
      // Remove the document where the field a is equal to 3.
      //{ a : 3 }
      collection.deleteOne(inData, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
      });

      client.close();
    });
  }
}
export default new mongodbObj();