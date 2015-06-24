var path=require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;



//Cargar el modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite y Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
				{dialect: protocol, 
				protocol: protocol,	
				port: port,
				host: host,
				storage: storage, //Solo SQLite (.env)
				omitNull: true    //Solo Postgres	
				}
			);

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz= sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //Exportar la definicon de la tabla Quiz


//sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0) { //La ztabla se inicializa solo si esta vacia
			Quiz.bulkCreate( 
        			[ {pregunta: 'Capital de Italia',   respuesta: 'Roma'},
          			{pregunta: 'Capital de Portugal', respuesta: 'Lisboa'}
        			]
				      ).then(function(){console.log('Base de datos inicializada')});
	};
 });
});