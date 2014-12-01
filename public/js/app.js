// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


/**
 * @license FBComments v0.1
 * (c) 2014,  faffyman@gmail.com
 * License: MIT
 * =================================================================
 */


var model = {

     pages: [ ],

     allcomments: [ ],

    winner: ""
 };


var FbComApp = angular.module("FbComApp", []);

FbComApp.controller("FbComCtrl", function ($scope, $http) {

    // main app model.
    $scope.fbcomments = model;

    // URL parser
    $scope.parser = document.createElement('a');


    // Function for adding new items.
    $scope.addNewItem = function (pageText) {

        //check the pageText - if it's a facebook URL, try to extract the facebook item graph id.
        var path = "";
        var aParts = "";
        var pageID = "" ;
        var pageTitle = "";

        var pos = pageText.toLowerCase().indexOf('https://www.facebook.com/');

        if (  pos ===0  ) {
            $scope.parser.href = pageText;
            path = $scope.parser.pathname;
            aParts = path.split('/')
            pageID = aParts[parseInt(aParts.length)-2];
            pageTitle= pageID;
        } else {
            pageID = pageTitle = pageText;
        }

        var entity = { title: pageTitle, url: pageText, fbid: pageID };

        // only push if it doesn't exist in the array yet.

        //otherwise treat it as a separate entity.
        $scope.fbcomments.pages.push(entity);

        //get comments for that ID.
        $scope.getPostComments(entity);

        return false;

    }


    // Get a Random entrant
    $scope.pickRandom = function(){
        $topLimit = $scope.fbcomments.allcomments.length;

        var winner = Math.floor(Math.random() * ($topLimit - 0 + 1)) + 0;

        //winner = $scope.fbcomments.allcomments.pickRandom();

        //$scope.fbcomments.winner = winner;
        $scope.fbcomments.winner = $scope.fbcomments.allcomments[winner];



        return false;

    }



    // get comments for each entity (pages)
    $scope.getPostComments = function (postEntity) {


            var graphURL = "https://graph.facebook.com/comments/?limit=3000000&ids=";
                graphURL = graphURL  + postEntity.fbid ;

            $http.get(graphURL).success(function (data) {

                //for other 3rd party URLs.
                if (data[postEntity.fbid].hasOwnProperty('comments')) {

                    for (key in data[postEntity.fbid].comments.data) {
                        $scope.fbcomments.allcomments.push(data[postEntity.fbid].comments.data[key]);
                    }

                } else {
                    // works for faacebook URLs when just adding a facebook entity ID
                    for (key in data[postEntity.fbid].data) {
                        $scope.fbcomments.allcomments.push(data[postEntity.fbid].data[key]);
                    }
                }

            }); //end function


    }

    //

});