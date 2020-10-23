
/*
 * GET transform feature.
 */

var mysql = require('node-mysql');
var DB = mysql.DB;
var fs = require('fs');

var db = new DB({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'dannyscomedyclub_test'
});

var getJSON = function(connection, res) {
    var query = "SELECT node.nid, node.type, node.title, node.vid, field_data_body.body_value, field_data_field_referer.field_referer_value from node INNER JOIN field_data_body ON field_data_body.entity_id = node.nid INNER JOIN field_data_field_referer ON field_data_field_referer.entity_id = node.nid where (node.type = 'pressquotes' AND field_data_body.bundle = 'pressquotes')";
    var rows = [], ind = {};

    var Query = connection.query(query);
    Query.on('result', function(row) {
        ind = {
            "nid": row["field_referer_value"],
            "type": row["type"],
            "title": row["title"],
            "body": row["body_value"],
            "vid": row["vid"],
            "primarynid": row["nid"]
        };
        rows.push(ind);
    }).on('end', function() {
        fs.writeFileSync('transform.json', JSON.stringify(rows));
        console.log(rows.length);
        connection.release();
        db.end();
        res.end();
    });
};

exports.returnJSON = function(req, res){
    db.connect(function(connection, cb) {
        getJSON(connection, res);
    });
};