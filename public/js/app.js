// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


// angular app
// ================================================================

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
        console.log('pos', pos);

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

        console.log( $scope.fbcomments.winner);


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


        console.log($scope.fbcomments.allcomments);

    }

    //

});




/**
 Sample Graph Call URL
 https://graph.facebook.com/comments/?limit=3000000&ids=http://www.forestside.co.uk/lookbook/autumn2014/,808541022502338,802221316467642,800659843290456


 Sample output from graph call

808541022502338: {
    comments: {
        data: [
            {
                id: "808541022502338_808566012499839",
                can_remove: false,
                created_time: "2014-10-09T11:49:42+0000",
                from: {
                    category: "Shopping/retail",
                    category_list: [
                        {
                            id: "109527622457518",
                            name: "Shopping Mall"
                         }
                    ],
                    name: "Forestside",
                    id: "124378627585251"
                },
                like_count: 3,
                message: "Hi Folks, Make sure you comment on our Look Book on the link provided above to be entered into the competition! The Look Book is hosted on our website. Thanks & good luck!",
                user_likes: false
            },
            {
                id: "808541022502338_812790792077361",
                can_remove: false,
                created_time: "2014-10-17T16:32:42+0000",
                from: {
                    id: "694843688",
                    name: "Jacqui Mannis"
                },
                like_count: 1,
                message: "Winter florals and pastels my fav! X",
                user_likes: false
            }
        ]
    }
}




 */