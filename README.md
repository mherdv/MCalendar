# MCalendar
DatePicker create example  


var cal = new MCalendar('.calendarContainer',{
    calendarsCount:5 ,
    calendarType: 'fromTo',
    calendarView: 'slide3',
    availableDates: function(date){

        if(date<new Date()){
            return {disabled:true, class_list: 'a b c d'}
        } 
        return {}
    },
    
    selectCollBack: function (date){
        console.log(date)
    }
})




calendarType can be normal , fromTo , lot.
calendarView can be normal , slide2 , slide3, scroll .


scroll  is not fully implemented


selectCollBack is dev collBack .
