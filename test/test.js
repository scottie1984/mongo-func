var assert = require('assert');
var mf = require('../lib');
var R = require('ramda');

describe('Mongo', function() {

  var findOner = mf.findOne('mongodb://localhost:27017/mongo-func');
  var finder = mf.find('mongodb://localhost:27017/mongo-func');
  var inserter = mf.insert('mongodb://localhost:27017/mongo-func');
  var updater = mf.update('mongodb://localhost:27017/mongo-func');
  var remover = mf.remove('mongodb://localhost:27017/mongo-func');
  var counter = mf.count('mongodb://localhost:27017/mongo-func');
  var distincter = mf.distinct('mongodb://localhost:27017/mongo-func');

  var findOneFromTest = findOner('test');
  var finderFromTest = finder('test');
  var insertToTest = inserter('test');
  var updateToTest = updater('test');
  var removeFromTest = remover('test');
  var countFromTest = counter('test');
  var distinctFromTest = distincter('test');

  beforeEach(function(done) {
      mf.dropCollection('mongodb://localhost:27017/mongo-func', 'test')().then(function(){
        done();
      }).catch(function() {
        done();
      });
  });

  describe('connection error', function () {
      it('should return an error when it cannot connect to mongo', function (done) {
        mf.findOne('mongodb://hostnothere:999/mongo-func', 'test', {})().then(function(result) {

        }).catch(function(err) {
           assert.equal(err.name, 'MongoError');
           done();
        });
      });
  });

  describe('findOne (non-curry)', function () {
    it('should return null when document not found', function (done) {
      mf.findOne('mongodb://localhost:27017/mongo-func', 'test', {})().then(function(docs) {
         assert.equal(docs, null);
         done();
      });
    });

    it('should return document when document is found', function (done) {
      mf.insert('mongodb://localhost:27017/mongo-func', 'test', {scooby: 'doo'})().then(function(result) {
           mf.findOne('mongodb://localhost:27017/mongo-func', 'test', {scooby: 'doo'})().then(function(doc) {
                assert.equal(doc.scooby, 'doo');
                done();
           });
      });
    });
  });

  describe('findOne (curry)', function () {

      it('should return document when document is found', function (done) {
        inserter('test', {scooby: 'doo'})().then(function(result) {
             findOner('test', {scooby: 'doo'})().then(function(doc) {
                  assert.equal(doc.scooby, 'doo');
                  done();
             });
        });
      });

      it('should return document when document is found', function (done) {
          insertToTest({scooby: 'doo'})().then(function(result) {
               findOneFromTest({scooby: 'doo'})().then(function(doc) {
                    assert.equal(doc.scooby, 'doo');
                    done();
               });
          });
      });

      it('should allow a function to be passed into finder', function (done) {
            var byScooby = function(name) { return { scooby : name }; };
            var findOneFromTestByScooby = findOneFromTest(byScooby);
            insertToTest({scooby: 'doo'})().then(function(result) {
                 findOneFromTestByScooby('doo').then(function(doc) {
                     assert.equal(doc.scooby, 'doo');
                     findOneFromTestByScooby('woo').then(function(doc2) {
                        assert.equal(doc2, undefined);
                        done();
                     });
                 });
            });
      });

      it('should allow a function with multiple parameters to be passed into finder', function (done) {
          var byScoobyAndLive = function(name, isLive) { return { scooby : name, live : isLive }; };
          var findOneFromTestByScoobyAndLive = findOneFromTest(byScoobyAndLive);
          insertToTest({scooby: 'doo', live: true})().then(function(result) {
               findOneFromTestByScoobyAndLive('doo', true).then(function(doc) {
                   assert.equal(doc.scooby, 'doo');
                   findOneFromTestByScoobyAndLive('doo', false).then(function(doc2) {
                      assert.equal(doc2, undefined);
                      done();
                   });
               });
          });
      });

      it('should allow a function with multiple parameters to be passed and curried into finder', function (done) {
            var byScoobyAndLive = function(name, isLive) { return { scooby : name, live : isLive }; };
            var findOneFromTestByScoobyAndLive = findOneFromTest(byScoobyAndLive);
            var findOneFromTestByScoobyDooAndLive = findOneFromTestByScoobyAndLive('doo');
            insertToTest({scooby: 'doo', live: true})().then(function(result) {
                 findOneFromTestByScoobyDooAndLive(true).then(function(doc) {
                     assert.equal(doc.scooby, 'doo');
                     done();
                 });
            });
      });

      it('should allow to curry the returning function', function (done) {
            insertToTest({scooby: 'doo', scrappy: 'don"t'})().then(function(result) {
                 findOneFromTest({scooby: 'doo'})().then(R.pick(['scrappy'])).then(function(doc){
                     assert.equal(doc.scooby, undefined);
                     assert.equal(doc.scrappy, 'don"t');
                     done();
                 });
            });
      });
  });

  describe('update', function () {

      it('should update a document matching the query', function (done) {
          insertToTest({scooby: 'doo', scrappy: 'woo'})()
              .then(updateToTest({scooby: 'doo'}, {$set: {scooby: 'too'}}))
              .then(findOneFromTest({scooby: 'too'}))
              .then(function(doc) {
                        assert.equal(doc.scooby, 'too');
                        assert.equal(doc.scrappy, 'woo');
                        done();
                    });
      });

      var updateToTestForScoobyDoo = updateToTest({scooby: 'doo'});

      it('should update a document matching the query using function compose and currying', function (done) {

          var insertAndUpdate = R.composeP(findOneFromTest({scooby: 'too'}),
                                        updateToTestForScoobyDoo({$set: {scooby: 'too'}}),
                                        insertToTest({scooby: 'doo', scrappy: 'woo'}));
          insertAndUpdate()
              .then(function(doc) {
                        assert.equal(doc.scooby, 'too');
                        assert.equal(doc.scrappy, 'woo');
                        done();
                    });
      });

      it('should update a document matching the query as a function', function (done) {

            var findScooby = function(name) { return { scooby: name}; };
            var updateScooby = updateToTest(findScooby, {$set: {scooby: 'too'}});

            insertToTest({scooby: 'doo', scrappy: 'woo'})()
                .then(updateScooby('doo'))
                .then(findOneFromTest({scooby: 'too'}))
                .then(function(doc) {
                          assert.equal(doc.scooby, 'too');
                          assert.equal(doc.scrappy, 'woo');
                          done();
                      });
      });

      it.skip('should update a document matching the query as a function and update as a function', function (done) {

          var findScooby = function(name) { return { scooby: name}; };
          var updateScooby = function(name) { return {$set: {scooby: name}}; };
          var updateScoobyToo = updateToTest(findScooby, updateScooby);

          insertToTest({scooby: 'doo', scrappy: 'woo'})()
              .then(updateScoobyToo('doo')('too'))
              .then(findOneFromTest({scooby: 'too'}))
              .then(function(doc) {
                        assert.equal(doc.scooby, 'too');
                        assert.equal(doc.scrappy, 'woo');
                        done();
                    });
      });

  });

  describe('find', function () {

    it('should return all documents matching query', function (done) {

        var insertAndFindScoobyDoo = R.composeP(finderFromTest({scooby: 'doo'}),
                                      insertToTest({scooby: 'dont', scrappy: 'foo'}),
                                      insertToTest({scooby: 'doo', scrappy: 'loo'}),
                                      insertToTest({scooby: 'doo', scrappy: 'woo'}));
        insertAndFindScoobyDoo()
            .then(function(docs) {
                      assert.equal(docs.length, 2);
                      assert.equal(docs[0].scrappy, 'woo');
                      assert.equal(docs[1].scrappy, 'loo');
                      done();
                  });
    });

    it('should return all documents matching query with operation', function () {

		var insertAndFindScoobyDoo = R.composeP(finderFromTest({scooby: 'doo', limit: 1}),
									  insertToTest({scooby: 'dont', scrappy: 'foo'}),
									  insertToTest({scooby: 'doo', scrappy: 'loo'}),
									  insertToTest({scooby: 'doo', scrappy: 'woo'}));
		return insertAndFindScoobyDoo()
			.then(function(docs) {
					  assert.equal(docs.length, 1);
					  assert.equal(docs[0].scrappy, 'woo');
				  });
	});

	it('should return all documents matching query with operation sort', function () {

		var insertAndFindScoobyDoo = R.composeP(finderFromTest({scooby: 'doo', limit: 2, sort: { scrappy: 1 }}),
									  insertToTest({scooby: 'doo', scrappy: 'B'}),
									  insertToTest({scooby: 'doo', scrappy: 'A'}),
									  insertToTest({scooby: 'doo', scrappy: 'C'}));
		return insertAndFindScoobyDoo()
			.then(function(docs) {
					  assert.equal(docs.length, 2);
					  assert.equal(docs[0].scrappy, 'A');
					  assert.equal(docs[1].scrappy, 'B');
				  });
	});

  });

  describe('remove', function () {

      it('should remove a document from the collection', function (done) {

        var insert2Docs = R.composeP(insertToTest({scooby: 'doo', scrappy: 'foo'}),
                                        insertToTest({scooby: 'doo', scrappy: 'woo'}));
          insert2Docs()
              .then(finderFromTest({scooby: 'doo'}))
              .then(function(docs) {
                assert.equal(docs.length, 2);
              })
              .then(removeFromTest({scrappy: 'foo'}))
              .then(finderFromTest({scooby: 'doo'}))
              .then(function(docs) {
                 assert.equal(docs.length, 1);
                 assert.equal(docs[0].scrappy, 'woo');
                 done();
              });
      });

  });

  describe('count', function () {

        it('should count documents in the collection', function (done) {

          var insert3Docs = R.composeP(insertToTest({scooby: 'doo', scrappy: 'foo'}),
                                          insertToTest({scooby: 'doo', scrappy: 'woo'}),
                                          insertToTest({scooby: 'doo', scrappy: 'woo'}));
            insert3Docs()
                .then(countFromTest({scooby: 'doo'}))
                .then(function(count) {
                  assert.equal(count, 3);
                })
                .then(countFromTest({scooby: 'doo', scrappy: 'woo'}))
                .then(function(count) {
                   assert.equal(count, 2);
                   done();
                });
        });

    });

    describe('distinct', function () {

		it('should return distinct fields in collection', function () {

		  var insert3Docs = R.composeP(insertToTest({scooby: 'doo', scrappy: 'foo'}),
										  insertToTest({scooby: 'doo', scrappy: 'woo'}),
										  insertToTest({scooby: 'doo', scrappy: 'woo'}));
			return insert3Docs()
				.then(distinctFromTest('scrappy'))
				.then(function(result) {
				  assert.deepEqual(result, ['woo', 'foo']);
				});
		});

	});

  describe('connection with object', function () {
    it('should return null when document not found', function (done) {
      mf.findOne({ connectionString: 'mongodb://localhost:27017/mongo-func' }, 'test', {})().then(function(docs) {
         assert.equal(docs, null);
         done();
      });
    });
  });

  describe('stats', function () {

      it('should return stats for the DB', function (done) {

        var stats = mf.stats('mongodb://localhost:27017/mongo-func');

        stats
          .then(function(stats) {
             assert.equal(stats.ok, 1);
             done();
          });
      });

  });
});
