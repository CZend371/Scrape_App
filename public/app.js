$(document).ready(function () {
    function scrapePage() {
        $("#scrape").click(function (e) {
            e.preventDefault();
            // Grab the articles as a json
            $.get("/articles").then(function (data) {
                console.log("scrape button clicked");
                // For each one
                for (var i = 0; i < data.length; i++) {
                    var card = $("<div class='card'/>");
                    var cardHeader = $("<div class='card-header'" + "data-id=" + data[i]._id + "/>");
                    var saveButton = $("<button id='save-article' class='btn btn-success' type='submit'>Save article</button>");
                    var cardBody = $("<div class='card-body'/>");
                    $("#articles").append(card);
                    $(card).append(cardHeader);
                    $(cardHeader).append($("<a href='https://www.gamespot.com" + data[i].link + "'>" + data[i].title + "</a>"));
                    $(cardHeader).append(saveButton);
                    $(card).append(cardBody);
                    $(cardBody).append(data[i].summary);
                }
            })
        });
    };
    scrapePage();

    function clearArticles() {
        $("#clear").click(function (e) {
            e.preventDefault();
            $("#articles").empty();
        })
    };
    clearArticles();

    function saveArticle() {
        $("#save-article").click(function () {
            console.log("save article button");
            // Grab the id associated with the article from the submit button
            var thisId = $(this).attr("data-id");

            // Run a POST request to change the note, using what's entered in the inputs
            $.ajax({
                method: "POST",
                url: "/articles/saved" + thisId,
                data: {
                    // Value taken from title input
                    title: $(this.title).val(),
                    // Value taken from note textarea
                    summary: $(this.summary).val(),
                    link: $(this.link).val(),
                }
            })
                // With that done
                .then(function (data) {
                    // Log the response
                    console.log(data);
                });
        })
    };
    saveArticle();

    // Whenever someone clicks a p tag
    $("#save-note").click(function () {
        console.log("save note button");
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
        console.log("save button clicked");
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/saved/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    })
});
