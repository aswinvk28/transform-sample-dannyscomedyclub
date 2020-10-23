
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
    var query = "SELECT node.nid, field_date.field_date_value, show_status.field_show_status_tid, two_255.field_text_255_two_value FROM node LEFT JOIN field_data_field_show_status AS show_status ON show_status.entity_id=node.nid LEFT JOIN field_data_field_text_255_two AS two_255 ON (two_255.entity_id=node.nid AND two_255.bundle='shows') LEFT JOIN field_data_field_date AS field_date ON (field_date.entity_id=node.nid AND field_date.bundle='shows') WHERE node.type='shows'";
    var rows = [], ind = {};

    var Query = connection.query(query);
    Query.on('result', function(row) {
        ind = {
            "entity_node_shows_id": row["nid"],
            "entity_taxonomy_event_status_id": row["field_show_status_tid"],
            "image_caption": row["field_text_255_two_value"],
            "field_date": row["field_date_value"]
        };
        rows.push(ind);
    }).on('end', function() {
        fs.writeFileSync('show-properties.json', JSON.stringify(rows));
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