

class MCalendar {
  constructor(container, options) {
    this._container = document.querySelector(container);
    this._startDate = options.startDate || new Date();
    this._selectedDate = options.startDate || new Date();
    this._calendarsCount = options.calendarsCount || 2;
    this.calendarType = options.calendarType || "normal";
    this.calendarView = options.calendarView || "normal";
    this.clickCount = 0;
    this.fastChangeDateParams = {};
    this.selectCollBack = options.selectCollBack;

    this.availableDates = options.availableDates || null;

    if (this.calendarType == "fromTo" || this.calendarType == "lot")
      this.selectedDate = [];

    if (this.calendarView == "slide2" || this.calendarView == "slide3") {
      this.startDate.setMonth(this.startDate.getMonth() - 1);
    }
    if (this.calendarView == "scroll") {
      this.startDate.setMonth(this.startDate.getMonth() - 3);
    }
    this.createCalendar();
    this.fastChangeDate();

    // if(allCalendarsContainer)
  }

  set startDate(date) {
    this._startDate = date;
  }
  set selectedDate(date) {
    this._selectedDate = date;
  }
  get container() {
    return this._container;
  }
  get startDate() {
    return this._startDate;
  }
  get calendarsCount() {
    return this._calendarsCount;
  }
  get selectedDate() {
    return this._selectedDate;
  }

  setCalendarView() {
    var type = this.calendarView;
    if (type == "slide2") {
      this.slide2();
    } else if (type == "slide3") {
      this.slide3();
    } else if (type == "scroll") {
      this.scroll();
    }
  }
  slide2(threeSlide) {
    var containerWidth;

    var container = this.container.querySelector(".allCalendarsContainer");
    container.classList.add("slide");
    var oneCalendar = container.querySelector("div");

    var style = window.getComputedStyle(oneCalendar);

    var margins =
      parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);

    if (threeSlide) {
      containerWidth = (oneCalendar.offsetWidth + margins) * 3;
    } else {
      containerWidth = (oneCalendar.offsetWidth + margins) * 2;
    }

    container.style.width = containerWidth + "px";

    var center = container.offsetWidth / (threeSlide ? 3 : 2);
    var leftEnd = center * 2;
    var start = 0;

    container.scrollLeft = center;

    container.addEventListener("click", event => {
      if (event.target.closest(".next_prev_container span:first-child")) {
        var container = this.container.querySelector(".allCalendarsContainer");

        container.scrollLeft = leftEnd;
        container.scrollTo({
          left: center,
          behavior: "smooth"
        });
      } else if (event.target.closest(".next_prev_container span:last-child")) {
        var container = this.container.querySelector(".allCalendarsContainer");

        container.scrollLeft = start;
        container.scrollTo({
          left: center,
          behavior: "smooth"
        });
      }
    });
  }
  slide3() {
    this.slide2(true);
  }
  scroll() {
    var container = this.container.querySelector(".allCalendarsContainer");
    container.classList.add("scroll");

    var oneCalendar = container.querySelector("div");

    var style = window.getComputedStyle(oneCalendar);
    var oneElemWidth =
      parseInt(style.width) +
      parseInt(style.marginLeft) +
      parseInt(style.marginRight) +
      17;

    var oneElemHeight =
      parseInt(style.width) +
      parseInt(style.marginTop) +
      parseInt(style.marginBottom);
    // `element` is the element you want to wrap
    var parent = container.parentNode;
    var wrapper = document.createElement("div");

    wrapper.classList.add("scrollElementParent");
    // set the wrapper as child (instead of the element)
    parent.replaceChild(wrapper, container);
    // set element as child of wrapper
    wrapper.appendChild(container);
    wrapper.style.width = oneElemWidth + "px";
    container.scrollTop = oneElemHeight * 3;
    // var minusTop = 50;

    container.addEventListener("scroll", event => {
      if (event.target.scrollTop == 0) {
        
        this.container.querySelector('.scroll').style.overflow = 'hidden'
        this.startDate.setMonth(this.startDate.getMonth() - 3);
        this.createCalendar();
        
      } else if (
        event.target.scrollTop >=
        oneElemHeight * 5
      ) {
        this.container.querySelector('.scroll').style.overflow = 'hidden'
        this.startDate.setMonth(this.startDate.getMonth() + 2);
        this.createCalendar();
      }
    });
  }

  getDaysInMonth(month, year) {
    // get 42 days in 1 datePicker
  
    var date = new Date(year, month, 1);
    var days = [];
    var day = date.getDay();
    while (day != 1) {
      date.setDate(date.getDate() - 1);
      day = date.getDay();
    }
    while (date.getMonth() !== month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    while (days.length != 42) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return { days, month };
  }
  selectOnDate(date) {
    this.selectedDate = date;
  }

  clearBackground() {
    var allRenderedElements = this.container.querySelectorAll(".rendered");
    [].forEach.call(allRenderedElements, e => {
      e.style.background = "transparent";
    });
  }

  createCalendar() {
    // if(this.calendarView == 'slide2'){
    //     this.startDate.setMonth(this.startDate.getMonth()-1)
    // }
    var datesToRender = this.dateInArray();
    var calendarsLength = datesToRender.length;

    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    // clear Container
    this.container.innerHTML = "";

    var allCalendarsContainer = document.createElement("div");
    allCalendarsContainer.classList.add("allCalendarsContainer");
    var calendarContainer;
    var yearAndMonth;
    var buttonsContainer;
    var nextButton;
    var prevButton;
    var dates;

    for (var i = 0; i < calendarsLength; i++) {
      // console.time('a')
      dates = this.renderedOneCalendar(
        datesToRender[i].days,
        datesToRender[i].month
      );
      //   console.timeEnd('a')
      calendarContainer = document.createElement("div");
      yearAndMonth = document.createElement("p");
      buttonsContainer = document.createElement("div");
      nextButton = document.createElement("span");
      prevButton = document.createElement("span");

      buttonsContainer.classList.add("next_prev_container");
      nextButton.innerHTML = ">";
      prevButton.innerHTML = "<";

      buttonsContainer.appendChild(prevButton);

      buttonsContainer.appendChild(yearAndMonth);

      buttonsContainer.appendChild(nextButton);

      prevButton.addEventListener("click", () => {
        // this.startDate = this.startDate.setMonth(this.startDate.getMonth-1)
        var cloneDate = new Date(+this.startDate);
        cloneDate.setMonth(cloneDate.getMonth() - 1);
        this.startDate = cloneDate;
        this.createCalendar();
        this.colorBetweenBackgrounds();
      });
      nextButton.addEventListener("click", () => {
        // this.startDate = this.startDate.setMonth(this.startDate.getMonth-1)
        var cloneDate = new Date(+this.startDate);
        cloneDate.setMonth(cloneDate.getMonth() + 1);
        this.startDate = cloneDate;
        this.createCalendar();

        this.colorBetweenBackgrounds();
      });

      calendarContainer.appendChild(buttonsContainer);
      calendarContainer.classList.add("MContainer");
      yearAndMonth.innerHTML = dates.year + " _ " + months[dates.month];
      yearAndMonth.setAttribute("data-year", dates.year);
      yearAndMonth.classList.add("date_header");
      // calendarContainer.appendChild(yearAndMonth)
      dates.days.forEach(e => {
        var container = document.createElement("div");
        container.classList.add("days_container");
        e.forEach(c => {
          container.appendChild(c);
        });
        calendarContainer.appendChild(container);
      });

      allCalendarsContainer.appendChild(calendarContainer);
    }

    this.container.appendChild(allCalendarsContainer);
    if (this.calendarView != "normal") {
      console.log(132);
      this.setCalendarView();
    }
  }

  renderedOneCalendar(datesArray, month) {
    var datesLength = datesArray.length;
    var mon = [],
      tue = [],
      Wed = [],
      Thu = [],
      Fri = [],
      Sat = [],
      Sun = [];
    var days = [];
    days.push(mon, tue, Wed, Thu, Fri, Sat, Sun);
    var daysType = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var span;
    for (var i = 0; i < daysType.length; i++) {
      span = document.createElement("span");
      span.innerHTML = daysType[i];
      days[i].push(span);
    }
    this.createOneDayElem(days, datesLength, datesArray, month);

    var date = datesArray[Math.floor(datesArray.length / 2)];

    var year = date.getFullYear();
    var month = date.getMonth();
    return { days, year, month };
  }
  createOneDayElem(days, datesLength, datesArray, month) {
    let day;
    let res;
    let elem;
    let date;
    var devClasses;
    var dateInNumber;
    for (var i = 0; i < datesLength; i++) {
      date = datesArray[i];
      day = date.getDay();
      res = {};
      elem = document.createElement("span");
      elem.innerHTML = date.getDate();
      elem.setAttribute("data-date", +date);
      elem.classList.add("rendered");
      if (date.getMonth() != month) {
        elem.classList.add("not_in_mount");
      }

      if (this.availableDates) {
        res = this.availableDates(date);
        devClasses = res.class_list || "";
        devClasses = devClasses.split(" ");
        if (res.disabled) {
          elem.classList.add("disabled", ...devClasses);
        }
      }

      switch (day) {
        case 0:
          days[6].push(elem);
          break;
        case 1:
          days[0].push(elem);
          break;
        case 2:
          days[1].push(elem);
          break;
        case 3:
          days[2].push(elem);
          break;
        case 4:
          days[3].push(elem);
          break;
        case 5:
          days[4].push(elem);
          break;
        default:
          days[5].push(elem);
          break;
      }

      // for dont save date oll objects in closers
      dateInNumber = +date;

      if (month + 1 == date.getMonth() + 1 && !res.disabled) {
        this.defaultSelectHandler(elem, dateInNumber);
      }
    }
  }
  colorBetweenBackgrounds() {
    var date1 = +this.selectedDate[0];
    var date2 = +this.selectedDate[1];
    [].forEach.call(document.querySelectorAll(".rendered"), e => {
      var data_attr = +e.getAttribute("data-date");
      if (data_attr > date1 && data_attr < date2) {
        e.style.background = "green";
      }
    });
  }
  defaultSelectHandler(elem, dateInNumber) {
    if (
      +this.selectedDate == dateInNumber ||
      +this.selectedDate[0] == dateInNumber ||
      +this.selectedDate[1] == dateInNumber
    ) {
      elem.style.background = "red";
    }
    if (Array.isArray(this.selectedDate)) {
      this.selectedDate.forEach(e => {
        if (+e == dateInNumber) {
          elem.style.background = "red";
        }
      });
    }

    elem.addEventListener(
      "click",
      function(date) {
        var numberedNewDate = +new Date(date);
        if (this.calendarType == "normal") {
          this.clickCount = 0;
          this.clearBackground();

          this.selectOnDate(numberedNewDate);
          elem.style.background = "red";
          // console.log(date)
        } else if (this.calendarType == "fromTo") {
          if (
            +numberedNewDate != +this.selectedDate[0] ||
            !!!this.selectedDate[0]
          )
            this.clickCount++;

          if (this.selectedDate[0] == undefined) {
            elem.style.background = "red";
            this.selectedDate = [numberedNewDate];
          } else if (
            this.selectedDate[1] == undefined &&
            +numberedNewDate !== +this.selectedDate[0]
          ) {
            elem.style.background = "red";
            this.selectedDate = [this.selectedDate[0], numberedNewDate];

            var date1 = +this.selectedDate[0];
            var date2 = +this.selectedDate[1];
            if (+this.selectedDate[0] > +this.selectedDate[1]) {
              this.selectedDate[0] = date2;
              this.selectedDate[1] = date1;
              console.log(this.selectedDate);
            }
            this.colorBetweenBackgrounds(date1, date2);
          } else {
            this.clickCount = 0;
            this.clearBackground();
            elem.style.background = "red";
            this.selectedDate = [numberedNewDate];
          }
        } else if ("lot") {
          var elemIndex = this.selectedDate.indexOf(numberedNewDate);
          if (elemIndex == -1) {
            elem.style.background = "red";
            this.selectedDate.push(numberedNewDate);
          } else {
            this.selectedDate.splice(elemIndex, 1);
            elem.style.background = "transparent";
          }
        }

        this.selectCollBack(this.selectedDate);
      }.bind(this, dateInNumber)
    );
  }
  dateInArray() {
    var count = this.calendarsCount;
    if (this.calendarView == "slide2") {
      count = 4;
    }
    if (this.calendarView == "slide3") {
      count = 5;
    }
    if (this.calendarView == "scroll") {
      count = 9;
    }
    var date = this._startDate;
    date = new Date(date);

    var month = date.getMonth();
    var year = date.getFullYear();
    var datesArray = [];
    for (var i = 0; i < count; i++) {
      datesArray.push(this.getDaysInMonth(month, year));
      date = new Date(date.setMonth(month + 1));
      month = date.getMonth();
      year = date.getFullYear();
    }
    return datesArray;
  }
  fastChangeDate() {
    var fastChangeContainer;
    this.container.addEventListener("click", event => {
      if (!event.target.closest(".date_header")) return;
      var coordsToAdd = this.getCoords(event.target.closest(".MContainer"));

      var selfYear = +event.target.getAttribute("data-year");
      var startDate = new Date(new Date().setFullYear(selfYear));

      if (fastChangeContainer) fastChangeContainer.innerHTML = "";
      else {
        fastChangeContainer = document.createElement("div");
        fastChangeContainer.classList.add("fastChangeContainer");
      }

      fastChangeContainer.style.left = coordsToAdd.left + "px";
      fastChangeContainer.style.top = coordsToAdd.top + "px";

      this.createMonthList(fastChangeContainer);
      this.createYearList(fastChangeContainer, startDate);

      this.container.appendChild(fastChangeContainer);
      var yearUl = this.container.querySelector(".yearList");
      yearUl.scrollTop = yearUl.scrollHeight / 2 - 70;
      yearUl.addEventListener("scroll", this.yearUlScrollHandler);

      this.createFCConfirm(fastChangeContainer);
    });
  }

  createFCConfirm(fastChangeContainer) {
    var selectedDateContainer = document.createElement("div");
    var confirmButton = document.createElement("span");
    var closeButton = document.createElement("span");

    selectedDateContainer.classList.add("selectedDateContainer");
    confirmButton.classList.add("changeYearButton");
    closeButton.classList.add("closeFCModal");

    confirmButton.innerHTML = "confirm";
    closeButton.innerHTML = "close";

    selectedDateContainer.appendChild(closeButton);
    selectedDateContainer.appendChild(confirmButton);
    fastChangeContainer.appendChild(selectedDateContainer);

    confirmButton.addEventListener("click", _ => {
      if (this.fastChangeDateParams.year)
        this.startDate.setFullYear(this.fastChangeDateParams.year);
      if (this.fastChangeDateParams.month)
        this.startDate.setMonth(this.fastChangeDateParams.month);
      if (this.calendarView == "slide2" && this.fastChangeDateParams.month ||this.calendarView == "slide3" &&this.fastChangeDateParams.month ) {
        this.startDate.setMonth(this.fastChangeDateParams.month - 1);
      }
      this.createCalendar();
      this.fastChangeDateParams = {};
      fastChangeContainer = false;
    });

    closeButton.addEventListener("click", () => {
      this.container.removeChild(fastChangeContainer);
      this.fastChangeDateParams = {};
      fastChangeContainer = false;
    });
    this.container.onclick = event => {
      if (event.target.closest(".date_header") || !fastChangeContainer) return;
      if (fastChangeContainer) this.container.removeChild(fastChangeContainer);

      this.fastChangeDateParams = {};
      fastChangeContainer = false;
    };
    fastChangeContainer.onclick = event => event.stopPropagation();
  }

  yearUlScrollHandler(event) {
    var elem = event.target;
    var maxScroll = elem.scrollHeight;
    var top = elem.scrollTop;
    var scrollPositionToBottom = top + elem.offsetHeight;
    var LiValue;
    if (top == 0) {
      var elemFirstLi = elem.querySelector("li:first-child");
      LiValue = elem.querySelector("li:first-child").innerText;
      for (var i = 0; i < 50; i++) {
        var li = document.createElement("li");
        li.innerHTML = --LiValue;
        elem.prepend(li);
      }
      var top = elemFirstLi.offsetTop - elem.offsetTop;
      elem.scrollTop = top;
    } else if (scrollPositionToBottom >= maxScroll) {
      LiValue = elem.querySelector("li:last-child").innerText;
      for (var i = 0; i < 50; i++) {
        var li = document.createElement("li");
        li.innerHTML = ++LiValue;
        elem.appendChild(li);
      }
    }
  }

  createMonthList(fastChangeContainer) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var monthContainer = document.createElement("div");
    var ul = document.createElement("ul");
    ul.classList.add("monthList");

    for (let index = 0; index < months.length; index++) {
      const element = months[index];
      var li = document.createElement("li");
      li.innerHTML = element;
      li.setAttribute("data-month", index);
      ul.appendChild(li);
    }

    ul.addEventListener("click", event => {
      if (event.target.tagName != "LI") return;
      var elem = event.target;
      var ul = event.currentTarget;
      var month = elem.getAttribute("data-month");
      this.fastChangeDateParams.month = month;

      [].forEach.call(event.currentTarget.querySelectorAll("li"), element => {
        element.classList.remove("selected");
      });
      elem.classList.add("selected");
      ul.scrollTop = elem.offsetTop - ul.offsetTop - elem.offsetHeight;
    });

    monthContainer.appendChild(ul);

    fastChangeContainer.appendChild(monthContainer);
  }

  createYearList(fastChangeContainer, startDate) {
    var yearContainer = document.createElement("div");
    var yearUl = document.createElement("ul");
    var centralLi = document.createElement("li");
    var selectedDate = startDate;
    var selectedPrev, selectedNext;
    yearUl.classList.add("yearList");

    centralLi.innerHTML = new Date(
      new Date().setFullYear(selectedDate.getFullYear())
    ).getFullYear();

    yearUl.appendChild(centralLi);

    for (var i = 0; i < 50; i++) {
      if (!!!selectedPrev || !!!selectedNext) {
        selectedNext = new Date();
        selectedNext.setFullYear(selectedDate.getFullYear() + 1);
        selectedPrev = new Date();
        selectedPrev.setFullYear(selectedDate.getFullYear() - 1);
      } else {
        selectedNext.setFullYear(selectedNext.getFullYear() + 1);
        selectedPrev.setFullYear(selectedPrev.getFullYear() - 1);
      }

      var Li = document.createElement("li");
      Li.innerHTML = selectedNext.getFullYear();
      yearUl.appendChild(Li);

      Li = document.createElement("li");
      Li.innerHTML = selectedPrev.getFullYear();
      yearUl.prepend(Li);
    }

    yearUl.addEventListener("click", event => {
      if (event.target.tagName != "LI") return;
      var elem = event.target;
      var ul = event.currentTarget;
      var value = elem.innerText;
      this.fastChangeDateParams.year = value;

      [].forEach.call(ul.querySelectorAll("li"), element => {
        element.classList.remove("selected");
      });
      elem.classList.add("selected");
      ul.scrollTop =
        elem.offsetTop - ul.offsetTop - ul.offsetHeight / 2 + elem.offsetHeight;
    });
    yearContainer.appendChild(yearUl);
    fastChangeContainer.appendChild(yearContainer);
  }

  getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
}
