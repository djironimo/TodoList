$(document).ready(function() {
    var newTask	= $("input[name='new_task']"),
        activeList = $(".active_list"),
        unactiveList = $(".unactive_list"),
        h2 = $("h2");

    printTasks();
    goodJob();
    //localStorage.clear();

    $("button").click(function(event) {
        event.preventDefault();
        if (newTask.val().trim()) {
            activeList.prepend('<li><label>' + "<input type='checkbox'>" + newTask.val() + "</label></li>");
            goodJob();
            if (!supports_html5_storage()) {
                return false;
            }
            addToStorage("unchecked", newTask.val());
        }
        newTask.val("");
    });

    activeList.on("change", "input[type='checkbox']", function(event) {
        event.preventDefault();         
        $(this).attr('checked', 'true');
        var li = $(this).closest('li');
        unactiveList.prepend("<li class='done-task'>" + li.html() + "</li>");
        changeGroup("unchecked", "checked", li.text());
        li.remove();
        goodJob();
    });

    unactiveList.on("change", "input[type='checkbox']", function(event) {
        event.preventDefault();
        $(this).removeAttr('checked');
        var li = $(this).closest('li');
        activeList.prepend("<li>" + li.html() + "</li>");
        changeGroup("checked", "unchecked", li.text());
        li.remove();
        goodJob();
    });

    function goodJob() {
        if (!activeList.text()) {
            h2.text("Good Job!");
        } else {
            h2.text("");
        }
    }

    function supports_html5_storage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
      }
    }

    function addToStorage(key, newElement) {
        if(localStorage[key] != "" && typeof localStorage[key] !== "undefined") {
            var oldArray = JSON.parse(localStorage[key]);
            oldArray.push(newElement);
            localStorage[key] = JSON.stringify(oldArray);
        } else {
            localStorage[key] = JSON.stringify([newElement]);
        }
    }

    function deleteFromStorage(key, element) {
        if(localStorage[key] != "" && typeof localStorage[key] !== "undefined") {
            var oldArray = JSON.parse(localStorage[key]);
            oldArray.splice(oldArray.indexOf(element), 1);
            localStorage[key] = JSON.stringify(oldArray);
        }
    }

    function changeGroup(keyOld, keyNew, element) {
        addToStorage(keyNew, element);
        deleteFromStorage(keyOld, element);
        console.log("unchecked: " + localStorage["unchecked"]);
        console.log("checked: " + localStorage["checked"]);
    }

    function printTasks() {
        for(var i = 0; i < JSON.parse(localStorage["unchecked"]).length; i++){
            activeList.prepend('<li><label>' + "<input type='checkbox'>" + JSON.parse(localStorage["unchecked"])[i] + "</label></li>");
        }
        for(var i = 0; i < JSON.parse(localStorage["checked"]).length; i++){
            unactiveList.prepend('<li class="done-task"><label>' + "<input type='checkbox' checked='checked'>" + JSON.parse(localStorage["checked"])[i] + "</label></li>");
        }
    }

});