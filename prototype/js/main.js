function Scrumboard (element) {
    var scrumboard = {},
        items = getItems(),
        _dropTarget;

    function getItems () {
        return [
            {
                id: 1,
                title: 'Item 1',
                owner: 'Owner 1',
                dev: 'Dev 1'
            },
            {
                id: 2,
                title: 'Item 2',
                owner: 'Owner 2',
                dev: 'Dev 2'
            },
            {
                id: 3,
                title: 'Item 3',
                owner: 'Owner 3',
                dev: 'Dev 3'
            },
            {
                id: 4,
                title: 'Item 4',
                owner: 'Owner 4',
                dev: 'Dev 4'
            },
            {
                id: 5,
                title: 'Item 5',
                owner: 'Owner 5',
                dev: 'Dev 5'
            },
            {
                id: 6,
                title: 'Item 6',
                owner: 'Owner 6',
                dev: 'Dev 6'
            },
        ];
    }
    
    scrumboard.setProperties = function () {
        console.log('setProperties');
        scrumboard.element = element;
        scrumboard.bucketContainer = element.querySelector('.bucket-container');
        scrumboard.readyBucket = scrumboard.bucketContainer.querySelector('.bucket-ready');
        scrumboard.calendarContainer = element.querySelector('.calendar-container');
        scrumboard.calendar = element.querySelector('.calendar');
    };
    
    scrumboard.renderItems = function () {
        console.log('renderItems');
        var itemsFrag = document.createDocumentFragment();
        items.forEach(function (item) {
            var itemEl = document.createElement('div'),
                innerHTML = [];
            itemEl.classList = 'work-item';
            itemEl.setAttribute('draggable', 'true');
            innerHTML.push('<h2>' +item.id + ': ' + item.title + '</h2>');
            innerHTML.push('<div class="item-content">');
                innerHTML.push('<p>Owner: ' + item.owner + '</p>');
                innerHTML.push('<p>Developer: ' + item.dev + '</p>');
            innerHTML.push('</div>');
            itemEl.innerHTML = innerHTML.join('');
            
            itemsFrag.appendChild(itemEl);
        });
        scrumboard.readyBucket.appendChild(itemsFrag);
    };
    
    scrumboard.renderCalendar = function () {
        console.log('renderCalendar');
        var calendarFrag = document.createDocumentFragment(),
            totalWeeks = 3,
            daysPerWeek = 7,
            w,
            d;
        for (w = 0; w < totalWeeks; w++) {
            var weekEl = document.createElement('div');
            weekEl.classList = 'week week-' + (w+1);
            for (d = 0; d < daysPerWeek; d ++) {
                var dayEl = document.createElement('div');
                dayEl.classList = 'day day-' + (d+1);
                weekEl.appendChild(dayEl);
            }
            calendarFrag.appendChild(weekEl);
        }
        scrumboard.calendar.appendChild(calendarFrag);
    };
    
    scrumboard.renderLayout = function () {
        console.log('renderLayout');
        scrumboard.renderItems();
        scrumboard.renderCalendar();
    };
    
    scrumboard.bindListeners = function () {
        console.log('bindListeners');
        element.addEventListener('dragstart', _handleDragStart.bind(this));
        element.addEventListener('dragend', _handleDragEnd.bind(this));
        scrumboard.calendar.addEventListener('dragover', _handleDragOver.bind(this));
        scrumboard.bucketContainer.addEventListener('dragover', _handleDragOver.bind(this));
        scrumboard.calendar.addEventListener('dragenter', _handleDragEnter.bind(this));
        scrumboard.bucketContainer.addEventListener('dragenter', _handleDragEnter.bind(this));
        scrumboard.calendar.addEventListener('dragleave', _handleDragLeave.bind(this));
        scrumboard.bucketContainer.addEventListener('dragleave', _handleDragLeave.bind(this));
    };
    
    _setDropTarget = function (dropTarget) {
        if (dropTarget.classList.contains('day') || dropTarget.classList.contains('bucket')) {
            _dropTarget = dropTarget;
            _dropTarget.classList.add('highlight');
        }
    };
    
    _clearDropTarget = function (dropTarget) {
        if (dropTarget) {
            _dropTarget.classList.remove('highlight');
            _dropTarget = null;
        }
    };
    
    _handleDragStart = function (evt) {
        console.log('_handleDragStart');
    };
    
    _handleDragOver = function (evt) {
        console.log('_handleDragOver');
        evt.preventDefault();
    }
    
    _handleDragEnter = function (evt) {
        console.log('_handleDragEnter');
        evt.preventDefault();
        if (evt.target.classList.contains('day') || evt.target.classList.contains('bucket')) {
            _clearDropTarget(_dropTarget);
            _setDropTarget(evt.target);
        }
    }
    
    _handleDragLeave = function (evt) {
        console.log('_handleDragLeave');
        if (_dropTarget === evt.target) {
            _clearDropTarget(evt.target);
        }
    }
    
    _handleDragEnd = function (evt) {
        console.log('_handleDragEnd');
        evt.preventDefault();
        var item = evt.target;
        if (_dropTarget) {
            _dropTarget.appendChild(item);
            _clearDropTarget(_dropTarget);
        }
    };
    
    
    scrumboard.init = function () {
        console.log('Scrumboard init');
        scrumboard.setProperties();
        scrumboard.renderLayout();
        scrumboard.bindListeners();
    };
    
    scrumboard.init();
    
    return scrumboard;
}
(function () {
    var container = document.querySelector('#scrumboard'),
        scrumboard = Scrumboard(container);
})();