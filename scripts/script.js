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
 





