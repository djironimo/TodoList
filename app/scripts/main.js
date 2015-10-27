$(document).ready(function() {
    var newTask	= $("input[name='new_task']"),
        activeList = $(".active_list"),
        unactiveList = $(".unactive_list"),
        h2 = $("h2"),
        CONST_UNCHECKED = "unchecked",
        CONST_CHECKED = "checked";
    
    printTasks();
    goodJob();
    //localStorage.clear();

    $("button").click(function(event) {
        event.preventDefault();
        if (newTask.val().trim()) {
            activeList.prepend('<li><label>' + "<input type='checkbox'>" + newTask.val() + "</label></li>");
            goodJob();
            addToStorage(CONST_UNCHECKED, newTask.val());
        }
        newTask.val("");
    });

    activeList.on("change", "input[type='checkbox']", function(event) {
        event.preventDefault();         
        $(this).attr('checked', 'true');
        var li = $(this).closest('li');
        unactiveList.prepend("<li class='done-task'>" + li.html() + "</li>");
        changeGroup(CONST_UNCHECKED, CONST_CHECKED, li.text());
        li.remove();
        goodJob();
    });

    unactiveList.on("change", "input[type='checkbox']", function(event) {
        event.preventDefault();
        $(this).removeAttr('checked');
        var li = $(this).closest('li');
        activeList.prepend("<li>" + li.html() + "</li>");
        changeGroup(CONST_CHECKED, CONST_UNCHECKED, li.text());
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
        if (!supports_html5_storage()) {
            return false;
        }
        if(localStorage[key] != "" && typeof localStorage[key] !== "undefined") {
            var oldArray = JSON.parse(localStorage[key]);
            oldArray.push(newElement);
            localStorage[key] = JSON.stringify(oldArray);
        } else {
            localStorage[key] = JSON.stringify([newElement]);
        }
    }

    function deleteFromStorage(key, element) {
        if (!supports_html5_storage()) {
            return false;
        }
        if(localStorage[key] != "" && typeof localStorage[key] !== "undefined") {
            var oldArray = JSON.parse(localStorage[key]);
            oldArray.splice(oldArray.indexOf(element), 1);
            localStorage[key] = JSON.stringify(oldArray);
        }
    }

    function changeGroup(keyOld, keyNew, element) {
        addToStorage(keyNew, element);
        deleteFromStorage(keyOld, element);
    }

    function printTasks() {
        if (!supports_html5_storage()) {
            return false;
        }
        if(localStorage[CONST_UNCHECKED] != "" && typeof localStorage[CONST_UNCHECKED] !== "undefined") {
            for(var i = 0; i < JSON.parse(localStorage[CONST_UNCHECKED]).length; i++){
                activeList.prepend('<li><label>' + "<input type='checkbox'>" + JSON.parse(localStorage[CONST_UNCHECKED])[i] + "</label></li>");
            }
        }
        if(localStorage[CONST_CHECKED] != "" && typeof localStorage[CONST_CHECKED] !== "undefined") {
            for(var i = 0; i < JSON.parse(localStorage[CONST_CHECKED]).length; i++){
                unactiveList.prepend('<li class="done-task"><label>' + "<input type='checkbox' checked='checked'>" + JSON.parse(localStorage[CONST_CHECKED])[i] + "</label></li>");
            }
        }
    }

});