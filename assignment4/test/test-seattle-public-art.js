/*-----------------------------------------/
/ test-seattle-public-art.js
/
/ Description: test get, delete, and add
/ methods in seattle-public-art-methods.js
/
/ Derek S Wilson
/ Seattle Central College
/ ITC230 Advanced JavaScript
/ Assignment 4
/ May 2017
------------------------------------------*/

var expect = require("chai").expect;
var artMethods = require("../lib/seattle-public-art-methods"); // UUT

// test get method
describe("seattle-public-art-methods module", () => {
 it("returns requested art title and artist", function() {
   var result = artMethods.get("Thread");
   expect(result.attributes.Title).to.deep.equal("Thread");
   expect(result.attributes.Artist).to.deep.equal("Nichols Meisel");
 });
 
 it("return fails w/invalid art title", () => {
   var result = artMethods.get("Derek");
   expect(result).to.be.undefined;
 });
});

// test delete method
describe("seattle-public-art-methods module", () => {
 it("deleted title no longer exists and number deleted greater than zero", function() {
   var checkTitle = artMethods.get("Thread");
   expect(checkTitle).to.exist;  // check that object exists for title
   
   var result = artMethods.delete("Thread");
   expect(result.numDeleted).to.be.above(0);  // check num objects deletde > 0
   var checkTitle = artMethods.get("Thread");
   expect(checkTitle).to.not.exist;
 });
 
 it("delete fails w/invalid art title", () => {
   var result = artMethods.delete("Derek");  // a bogus title
   expect(result.numDeleted).to.be.deep.equal(0);
 });
});

// test add method
describe("seattle-public-art-methods module", () => {
 it("adds title now exists and number added greater than zero", function() {
   var result = artMethods.add('New Title');
   expect(result.numAdded).to.be.above(0);
   var checkTitle = artMethods.get('New Title');
   expect(checkTitle.attributes.Title).to.deep.equal('New Title');
 });
 
 it("return fails when art title added is deleted", () => {
    var result = artMethods.delete("New Title");  // delete title we added
    var checkTitle = artMethods.get('New Title');
    expect(checkTitle).to.be.undefined;
  });
});