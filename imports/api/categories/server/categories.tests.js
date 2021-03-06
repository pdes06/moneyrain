import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import './publications.js';
import '../methods.js';
import { Categories } from '../categories.js';

describe('Categories', () => {

  describe('collection', () => {
    it('exists', () => {
      Categories.find({}, {});
    });
  });

  describe('methods', () => {
    describe('categories.addNew', () => {
      let doc;
      let docAddedID;
      beforeEach(() => {
        doc = createCategoryDoc('Groceries');
      });
      it('can add new category', () => {
        const addNew = Meteor.server.method_handlers['categories.addNew'];
        docAddedID = addNew.apply(addNew, [doc]);
        assert.equal(Categories.find().count(), 1);
      });
      afterEach(() => {
        Categories.remove(docAddedID);
      });
    });
  });

  describe('publications', () => {
    describe('categories.all', () => {
      let collector;
      beforeEach(() => {
        collector = new PublicationCollector({userId: Random.id()});
      });
      it('can publish empty categories', (done) => {
        collector.collect('categories.all', (collections) => {
          assert.equal(collections['categories'].length, 0);
          done();
        });
      });

      describe('when some categories', () => {
        beforeEach(() => {
          Categories.insert(createCategoryDoc('Groceries'));
          Categories.insert(createCategoryDoc('Gifts'));
          Categories.insert(createCategoryDoc('Insurance'));
        });
        it('can publish categories', (done) => {
          collector.collect('categories.all', (collections) => {
            assert.equal(collections['categories'].length, 3);
            done();
          });
        });
        afterEach(() => {
          Categories.remove({});
        });
      });
    });
  });
});

// Helpers

export const createCategoryDoc = (name) => {
  check(name, String);
  return {
    name,
  };
};
