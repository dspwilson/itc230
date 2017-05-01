/*-----------------------------------------/
/ seattle-public-art-methods.js
/
/ Derek S Wilson
/ Assignment 3
/ ITC 230 Advanced JavaScript
/ Seattle Central College
/ April 2017
/
/ Description: Requires Seattle Public Art
/ GeoJSON file into art object, 
/ and provides methods to get
/ public art objects from the art object
/ and to delete public art objects from the
/ art object
/-----------------------------------------*/

// GeoJSON file with Seattle public art features
var art = require("../public/SeattlePublicArt.json"); 

exports.get = (artTitle) => {
    return art.features.find((feature) => {
        return feature.attributes.Title == artTitle;
    });
};

exports.delete = (artTitle) => {
    var oldLength = art.features.length; // current number art objects
    
    var newArt = art.features.filter((feature) => {
        return feature.attributes.Title !== artTitle;
    });
    
    art.features = newArt; // array with deleted title replaces original art features array
    var newLength = art.features.length;  // new number art objects
    
    return {numDeleted : (oldLength - newLength),
            newLength: newLength};
};

exports.add = (artTitle) => {
    var oldLength = art.features.length; // current number art objects
    // Create JSON features object, existing art.features as prototype
    var newArt = {};
    Object.defineProperty(newArt, 'features');
    newArt.attributes.Title = artTitle;  // set value of new art Title property 
    
    // push the new feature onto the feaures array
    art.features.push(newArt); 

    var newLength = art.features.length; // new number art objects
    
    return {numAdded : (newLength - oldLength),
            newLength: newLength};

};
