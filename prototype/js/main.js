function Scrumboard (element) {
    var scrumboard = {},
        items = [],
        itemsHash = {},
        _dropTarget,
        serviceManager = ServiceManager(),
        csvToJson = CSVToJSON();

    function _getItems () {
        
        function getItemsSuccess (resp) {
            console.log(resp);
            items = csvToJson.convert(resp.currentTarget.responseText);
            items.forEach(function (item) {
                itemsHash[item['Formatted ID']] = item;
            });
            console.log(items);
            _init();
        }
        
        function getItemsError (evt) {
            alert(evt.currentTarget.statusText +'\n'+'Add an iterationstatus.csv to prototype/data');
        }
        
        var options = {
            success: getItemsSuccess,
            error: getItemsError
        }

        serviceManager.exec('/data/iterationstatus.csv', options);
    }
    
    function _setProperties () {
        console.log('setProperties');
        scrumboard.element = element;
        scrumboard.bucketContainer = element.querySelector('.bucket-container');
        scrumboard.readyBucket = scrumboard.bucketContainer.querySelector('.bucket-ready');
        scrumboard.calendarContainer = element.querySelector('.calendar-container');
        scrumboard.calendar = element.querySelector('.calendar');
    }
    
    function _renderItems () {
        console.log('renderItems');
        var itemsFrag = document.createDocumentFragment();
        items.forEach(function (item) {
            var itemEl = document.createElement('div'),
                innerHTML = [];
            itemEl.classList = 'work-item';
            itemEl.setAttribute('draggable', 'true');
            itemEl.setAttribute('work-item-id', item['Formatted ID']);
            innerHTML.push('<h2 class="item-id primary">' + item['Formatted ID'] + '</h2>');
            innerHTML.push('<h3 class="item-name secondary">' + item['Name'] + '</h3>');
            innerHTML.push('<div class="item-content secondary">');
                innerHTML.push('<p>Owner: ' + item['Owner'] + '</p>');
                innerHTML.push('<p>Developer: ' + item['Developer'] + '</p>');
                innerHTML.push('<p>Notes:</p>');
                innerHTML.push('<div>' + item['Notes'] + '</div>');
            innerHTML.push('</div>');
            itemEl.innerHTML = innerHTML.join('');
            
            itemsFrag.appendChild(itemEl);
        });
        scrumboard.readyBucket.appendChild(itemsFrag);
    }
    
    function _renderCalendar () {
        console.log('renderCalendar');
        var calendarFrag = document.createDocumentFragment(),
            totalWeeks = 3,
            daysPerWeek = 7,
            w = 0,
            d = 0,
            sprintD = 1;
        for (w = 0; w < totalWeeks; w++) {
            var weekEl = document.createElement('div');
            weekEl.classList = 'week week-' + (w+1);
            for (d = 0; d < daysPerWeek; d ++) {
                var dayEl = document.createElement('div'),
                    title = document.createElement('h2'),
                    content = document.createElement('div');
                dayEl.classList = 'day day-' + sprintD;
                content.classList = 'day-content';
                title.innerHTML = 'Day ' + sprintD;
                dayEl.appendChild(title);
                dayEl.appendChild(content);
                weekEl.appendChild(dayEl);
                sprintD ++;
            }
            calendarFrag.appendChild(weekEl);
        }
        scrumboard.calendar.appendChild(calendarFrag);
    }
    
    function _renderLayout () {
        console.log('renderLayout');
        _renderItems();
        _renderCalendar();
    }
    
    function _bindListeners () {
        console.log('bindListeners');
        element.addEventListener('dragstart', _handleDragStart.bind(this));
        element.addEventListener('dragend', _handleDragEnd.bind(this));
        scrumboard.calendar.addEventListener('dragover', _handleDragOver.bind(this));
        scrumboard.bucketContainer.addEventListener('dragover', _handleDragOver.bind(this));
        scrumboard.calendar.addEventListener('dragenter', _handleDragEnter.bind(this));
        scrumboard.bucketContainer.addEventListener('dragenter', _handleDragEnter.bind(this));
        scrumboard.calendar.addEventListener('dragleave', _handleDragLeave.bind(this));
        scrumboard.bucketContainer.addEventListener('dragleave', _handleDragLeave.bind(this));
        scrumboard.element.addEventListener('click', _handleElementClick.bind(this));
    }
    
    function _handleElementClick (evt) {
        console.log('_handleElementClick');
        var workItem,
            workItemId;
        if (evt.target.classList.contains('work-item')) {
            workItem = evt.target;
            workItemId = workItem.getAttribute('work-item-id');
            showWorkItem(workItemId);
            /*if (workItem.classList.contains('expanded')) {
                workItem.classList.remove('expanded');
            } else {
                workItem.classList.add('expanded');
            }*/
            
        }
    }
    
    function showWorkItem (workItemId) {
        var targetWorkItem = itemsHash[workItemId],
            dataStr = JSON.stringify(targetWorkItem);
        alert(dataStr);
    }
    
    function _setDropTarget (dropTarget) {
        if (dropTarget.classList.contains('day-content') || dropTarget.classList.contains('bucket')) {
            _dropTarget = dropTarget;
            _dropTarget.classList.add('highlight');
        }
    }
    
    function _clearDropTarget (dropTarget) {
        if (dropTarget) {
            _dropTarget.classList.remove('highlight');
            _dropTarget = null;
        }
    }
    
    function _handleDragStart (evt) {
        //console.log('_handleDragStart');
    }
    
    function _handleDragOver (evt) {
       // console.log('_handleDragOver');
        evt.preventDefault();
    }
    
    function _handleDragEnter (evt) {
        //console.log('_handleDragEnter');
        evt.preventDefault();
        if (evt.target.classList.contains('day-content') || evt.target.classList.contains('bucket')) {
            _clearDropTarget(_dropTarget);
            _setDropTarget(evt.target);
        }
    }
    
    function _handleDragLeave (evt) {
        //console.log('_handleDragLeave');
        if (_dropTarget === evt.target) {
            _clearDropTarget(evt.target);
        }
    }
    
    function _handleDragEnd (evt) {
        //console.log('_handleDragEnd');
        evt.preventDefault();
        var item = evt.target;
        if (_dropTarget) {
            _dropTarget.appendChild(item);
            _clearDropTarget(_dropTarget);
        }
    }
    
    function _init () {
        console.log('Scrumboard init');
        _setProperties();
        _renderLayout();
        _bindListeners();
    }
    
    _getItems();
    
    return scrumboard;
}

function ServiceManager () {

    function exec (url, options) {
        console.log('serviceManager.exec', url);
        var request = new XMLHttpRequest();

        function _handleLoad (evt) {
            console.log('_handleLoad');
            if (evt.currentTarget.status === 200) {
                options.success(evt);
            } else {
                options.error(evt);
            }
        }

        options = options || {}
        options.method = options.method || 'GET';
        options.success = options.success || function (){};
        options.error = options.error || function () {};
        request.addEventListener('load', _handleLoad);
        request.addEventListener('error', options.error);
        request.open(options.method, url);
        request.send();
    }

    return {
        exec: exec
    };
}

function CSVToJSON () {
    function convert (csv) {
        var lines = csv.split("\n"),
            result = [],
            headers = lines[0].split(","),
            i;

        for (i = 1; i < lines.length; i++) {

            var obj = {},
                currentline = lines[i].split(","),
                j;

            for (j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        return result; //JavaScript object
        //return JSON.stringify(result); //JSON
    }
    return {
        convert: convert
    };
}

(function () {
    var container = document.querySelector('#scrumboard'),
        scrumboard = Scrumboard(container);
})();