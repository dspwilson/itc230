/*-----------------------------------------/
/ seattle-public-art-methods.js
/
/ Derek S Wilson
/ Assignment 4
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
    // Create features object, existing art.features as prototype
    // properties in newArtAssign have first feature's values
    // Uses JSON methods to create a new objet of the JSON art.features proto
    var newArtFeature = JSON.parse(JSON.stringify(art.features[0]));

    newArtFeature.attributes.Title = artTitle; // new feature Title value assigned
    
    // push the new feature onto the feaures array
    art.features.push(newArtFeature); 

    var newLength = art.features.length; // new number art objects
    
    return {numAdded : (newLength - oldLength),
            newLength: newLength};
};
