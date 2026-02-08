const mysql2 = require('mysql2');

const connectionPool = mysql2.createPool({
  host: 'localhost',
  port: 3306,
  database: 'resinhook',
  user: 'root',
  password: 'root',
  connectionLimit: 5,
});

//*获取链接是否成功
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.log('获取链接失败', err);
    return;
  }
  // console.log(connection, "这个是获取连接数据库的连接对象");
  connection.connect((err) => {
    if (err) {
      console.log('和数据库交互失败');
    } else {
      console.log('和数据库交互成功');
    }
  });
  connection.release();
});
// connectionPool.execute((sql),(err,res)=>{})回调函数
const connection = connectionPool.promise();
//将原本基于回调改为promise

module.exports = connection;
