
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
    var query = "SELECT node.nid, dcc_p.show_nid, dcc_e_p.performer_id, show_status.field_show_status_tid, two.field_text_255_value, fd_fpt.field_performance_types_tid FROM \
node \
LEFT JOIN field_data_field_show_status AS show_status ON show_status.entity_id=node.nid \
LEFT JOIN field_data_field_text_255 AS two ON (two.entity_id=node.nid AND two.bundle='performances')\
INNER JOIN dcc_performance AS dcc_p ON dcc_p.pnid=node.nid \
LEFT JOIN field_data_field_performance_types AS fd_fpt ON fd_fpt.entity_id=node.nid \
LEFT JOIN dcc_entity_performer AS dcc_e_p ON dcc_e_p.entity_node_bundle_id=dcc_p.performer_nid \
WHERE node.type='performances'";
    var rows = [], ind = {};

    var Query = connection.query(query);
    Query.on('result', function(row) {
        ind = {
            "entity_node_bundle_id": row["nid"],
            "entity_taxonomy_event_status_id": row["field_show_status_tid"],
            "performance_video": (row["field_text_255_value"]) ? "http://www.youtube.com/watch?v=" + row["field_text_255_value"] : null,
            "entity_node_shows_id": row["show_nid"],
            "entity_performer_id": row["performer_id"],
            "entity_taxonomy_performances_types_id": row["field_performance_types_tid"]
        };
        rows.push(ind);
    }).on('end', function() {
        fs.writeFileSync('performance-properties.json', JSON.stringify(rows));
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