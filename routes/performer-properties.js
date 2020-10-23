
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
    database : 'drupal_sample'
});

var getJSON = function(connection, res) {
    var query = "SELECT node.nid, two_255.field_text_255_two_value, two.field_text_255_value FROM node LEFT JOIN field_data_field_text_255_two AS two_255 ON (two_255.entity_id=node.nid AND two_255.bundle='artistes') LEFT JOIN field_data_field_text_255 AS two ON (two.entity_id=node.nid AND two.bundle='artistes') WHERE node.type='artistes'";
    var rows = [], ind = {};

    var Query = connection.query(query);
    Query.on('result', function(row) {
        ind = {
            "entity_node_artistes_id": row["nid"],
            "performer_yt": row["field_text_255_value"] != null ?  ("http://www.youtube.com/watch?v=" + row["field_text_255_value"]) : null,
            "performer_website": row["field_text_255_two_value"] != null ? row["field_text_255_two_value"] : null
        };
        rows.push(ind);
    }).on('end', function() {
        fs.writeFileSync('performer-properties.json', JSON.stringify(rows));
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