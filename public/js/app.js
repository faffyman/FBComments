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

        document.getElementById('posturl').value =  '';

        //get comments for that ID.
        $scope.getPostComments(entity);



        return false;

    }



    // Delete an item and it's associated comments
    $scope.deleteItem = function (entity) {



        angular.forEach($scope.fbcomments.pages, function (item) {
            console.log('item', item);
            console.log('entity', entity);

            if (item === entity || item.title === entity.title) {
                console.log('delete item:',  item.title);

                // now remove item
                var itemindex =  $scope.fbcomments.pages.indexOf(item);
                $scope.fbcomments.pages.splice(itemindex,1);

                // remove all comments and rebuild
                $scope.fbcomments.allcomments = [];

                angular.forEach($scope.fbcomments.pages, function (page) {
                    $scope.getPostComments(page);
                });


                return false;
            }

        });

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
    $scope.getPostComments = function (postEntity, graphURL) {


        if (graphURL === undefined) {
            graphURL = "https://graph.facebook.com/comments/?limit=500&ids=";
            graphURL = graphURL  + postEntity.fbid ;
        }


        $http.get(graphURL).success(function (data) {

            var dataObject =  data[postEntity.fbid] || data ;

            //for other 3rd party URLs.
            if (dataObject.hasOwnProperty('comments')) {

                for (key in dataObject.comments.data) {
                    $scope.fbcomments.allcomments.push(dataObject.comments.data[key]);
                }

            } else {
                // works for facebook URLs when just adding a facebook entity ID
                for (key in dataObject.data) {
                    $scope.fbcomments.allcomments.push(dataObject.data[key]);
                }
            }
            //check for a "next" or "more" url and follow it.
            if (dataObject.paging.next) {


                var nextURL = dataObject.paging.next;
                nextURL = decodeURIComponent(nextURL);
                nextURL = nextURL.replace(/=+$/, ''); // remove any "=" chars from eth end of the string
                var PE = postEntity;

                console.log('next URL', nextURL);

                // recursivley call this function with the "after" url
                $scope.getPostComments(PE, nextURL);
            }

        }); //end function

    }

});