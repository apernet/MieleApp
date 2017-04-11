define(['jquery'], function($) {
    var Sqlite = function() {
        var storeinSqlite = function(data) {
            var db = null;
//            document.addEventListener('deviceready', function() {
            db = window.sqlitePlugin.openDatabase({name: 'miele.db', location: 'default'}, function(a) {
//                    flushData(a);
                createTables(a);
                insertUsers(a, data);
                insertCatalogsData(a, data);
                insertSurveys(a, data);
                showCatalogData(a);
                //error
            }, function(error) {
                console.log('Open database ERROR: ' + JSON.stringify(error));
                alert('Open database ERROR: ' + JSON.stringify(error));
            });
//            });
        };

        var flushData = function(db) {
            db.transaction(function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS users');
                tx.executeSql('DROP TABLE IF EXISTS mst_Surveys');
                tx.executeSql('DROP TABLE IF EXISTS mst_Questions');
                tx.executeSql('DROP TABLE IF EXISTS mst_QuestionAnswer');
                tx.executeSql('DROP TABLE IF EXISTS cat_QuestionsType');
                tx.executeSql('DROP TABLE IF EXISTS cat_AnswerType');
                tx.executeSql('DROP TABLE IF EXISTS mst_SurveyAnswer');
                tx.executeSql('DROP TABLE IF EXISTS mst_SurveyApplied');
                //                tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
            }, function(error) {
                console.log('FLUSH DATA ERROR: ' + error.message);
            }, function() {
                console.log('FLUSH DATA OK');
            });
        };

        var createTables = function(db) {
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, password text, last_name text, mothers_last_name text, email text)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_SurveySubject (id integer primary key, name text, last_name text, mothers_last_name, birthday text, address text,  telephone text, gender text, email text, newsletter integer, eventInformation integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_Surveys (id integer primary key, name text, welcome_text text, finish_text text, anon integer, idSurveyType integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_Questions (id integer primary key, idSurvey integer, text text, idQuestionType integer, idParent integer, answer text, required integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_QuestionAnswer (id integer primary key, text text, idQuestion integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS cat_QuestionsType (id integer primary key, name text, icon text)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS cat_AnswerType (id integer primary key, name text, idQuestionType integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_SurveyAnswer (id integer primary key, answer text, idQuestion integer, idQuestionAnswer integer, idAnswerType integer, idSurveyApplied integer)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS mst_SurveyApplied (id integer primary key, idSurveySubject integer )');

                //                tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
            }, function(error) {
                console.log('CREATE TABLES ERROR: ' + error.message);
            }, function() {
                console.log('CREATE TABLES OK');
            });

        };


        var insertUsers = function(db, data) {

            db.transaction(function(tx) {

                $(data.data.users).each(function() {
                    var query = "INSERT INTO users (id, name, password, last_name, mothers_last_name, email) VALUES (?,?,?,?,?,?)";
                    var questionType = [this.id, this.name, this.password, this.last_name, this.mothers_last_name, this.email];
                    console.log("inserting...");
                    console.log(questionType);
                    tx.executeSql(query, questionType, function(tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    },
                            function(tx, error) {
                                console.log('INSERT users: ' + error.message);
                            });
                });


            }, function(error) {
                console.log('INSERT USERS DATA: ' + error.message);
            }, function() {
                console.log('INSERT USERS DATA ok');
            });


            db.transaction(function(tx) {

                var query = "SELECT * FROM users";

                tx.executeSql(query, [], function(tx, resultSet) {

                    for (var x = 0; x < resultSet.rows.length; x++) {
                        console.log(resultSet.rows.item(x));
                    }
                },
                        function(tx, error) {
                            console.log('SELECT users error: ' + error.message);
                        });
            }, function(error) {
                console.log('SELECT USERS error: ' + error.message);
            }, function() {
                console.log('SELECT USERS ok');
            });
        };

        var insertCatalogsData = function(db, data) {
            console.log("");

            db.transaction(function(tx) {

                $(data.data.questionsType).each(function() {
                    var query = "INSERT INTO cat_QuestionsType (id, name, icon) VALUES (?,?,?)";
                    var questionType = [this.id, this.name, this.icon];
                    console.log("inserting...");
                    console.log(questionType);
                    tx.executeSql(query, questionType, function(tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    },
                            function(tx, error) {
                                console.log('INSERT cat_QuestionsType: ' + error.message);
                            });
                });


            }, function(error) {
                console.log('INSERT CATALOG DATA cat_QuestionsType: ' + error.message);
            }, function() {
                console.log('INSERT CATALOG DATA cat_QuestionsType ok');
            });


        };

        var insertSurveys = function(db, data) {
            console.log("");
            console.log("INSERTING SURVEYS");

            db.transaction(function(tx) {

                $(data.data.surveys).each(function() {
                    var query = "INSERT INTO mst_Surveys (id, name, welcome_text, finish_text, anon, idSurveyType) VALUES (?,?,?,?,?,?)";
                    var survey = [this.id, this.name, this.welcome_text, this.finish_text, this.anon, this.idSurveyType];
                    var questions = this.mst_questions;
                    console.log("inserting...");
                    console.log(survey);
                    tx.executeSql(query, survey, function(tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                        insertQuestions(db, questions);
                    },
                            function(tx, error) {
                                console.log('INSERT mst_Surveys: ' + error.message);
                            });
                });


            }, function(error) {
                console.log('INSERT SURVEY mst_Surveys: ' + error.message);
            }, function() {
                console.log('INSERT SURVEY mst_Surveys ok');
            });

            db.transaction(function(tx) {

                var query = "SELECT * FROM mst_Surveys";

                tx.executeSql(query, [], function(tx, resultSet) {

                    for (var x = 0; x < resultSet.rows.length; x++) {
                        console.log(resultSet.rows.item(x));
                    }
                },
                        function(tx, error) {
                            console.log('SELECT users error: ' + error.message);
                        });
            }, function(error) {
                console.log('SELECT SURVEYS error: ' + error.message);
            }, function() {
                console.log('SELECT SURVEYS ok');
            });

            db.transaction(function(tx) {

                var query = "SELECT * FROM mst_Questions";

                tx.executeSql(query, [], function(tx, resultSet) {

                    for (var x = 0; x < resultSet.rows.length; x++) {
                        console.log(resultSet.rows.item(x));
                    }
                },
                        function(tx, error) {
                            console.log('SELECT mst_Questions error: ' + error.message);
                        });
            }, function(error) {
                console.log('SELECT mst_Questions error: ' + error.message);
            }, function() {
                console.log('SELECT mst_Questions ok');
            });
        };

        var insertQuestions = function(db, questions) {
            console.log("");
            console.log("INSERTING QUESTIONS");

            db.transaction(function(tx) {
                $(questions).each(function() {
                    var query = "INSERT INTO mst_Questions (id, idSurvey, text, idQuestionType, idParent, answer, required) VALUES (?,?,?,?,?,?,?)";
                    var survey = [this.id, this.idSurvey, this.text, this.idQuestionType, this.idParent, this.answer, this.required];
                    console.log("inserting...");
                    console.log(survey);

                    tx.executeSql(query, survey, function(tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                    },
                            function(tx, error) {
                                console.log('INSERT mst_Surveys: ' + error.message);
                            });
                });



            }, function(error) {
                console.log('INSERT QUESTIONS QUESTIONS: ' + error.message);
            }, function() {
                console.log('INSERT QUESTIONS ok');
            });
        };

        var showCatalogData = function(db) {
            console.log("SHOWING CATALOG DATA");

            db.transaction(function(tx) {
                tx.executeSql('SELECT count(*) AS mycount FROM DemoTable', [], function(tx, rs) {
                    console.log('Record count : ' + rs.rows.item(0).mycount);
                }, function(tx, error) {
                    console.log('SELECT error: ' + error.message);
                });
                var query = "SELECT * FROM cat_QuestionsType";
                tx.executeSql(query, [], function(tx, resultSet) {

                    for (var x = 0; x < resultSet.rows.length; x++) {
                        console.log(resultSet.rows.item(x));
                    }
                },
                        function(tx, error) {
                            console.log('SELECT error: ' + error.message);
                        });
            });

//            db.transaction(function(tx) {
//
//                var query = "SELECT * FROM cat_QuestionsType";
//
//                tx.executeSql(query, [], function(tx, resultSet) {
//
//                    for (var x = 0; x < resultSet.rows.length; x++) {
//                        console.log(resultSet.rows.item(x));
//                    }
//                },
//                        function(tx, error) {
//                            console.log('SELECT error: ' + error.message);
//                        });
//            }, function(error) {
//                console.log('transaction error: ' + error.message);
//            }, function() {
//                console.log('transaction ok');
//            });
        };

    };

    return new Slite();
});