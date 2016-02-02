Template.eventDetails.onRendered(function () {
  
  // set eventBasic Details
	Session.set("eventDetails", {
    startDate : Session.get("selectedStartDate"),
    endDate : Session.get("selectedEndDate"),
  });

  Session.set("customType", undefined);

  // animations
  var myDiv = $("#animationPlaceholder");
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {
    height: 0, 
    onComplete : function () {
      var h = $(window).height() - $('.confirm-jumbo').offset().top - 2 * $('.confirm-jumbo').height();
      $('.event-details-form').height(h)
    }
  });
  
  // subscriptions
  Meteor.subscribe("engineers");
  Meteor.subscribe("dams");
  Meteor.subscribe("events");

  // register validations
  formValidations();
})


Template.eventDetails.helpers({
  getAllEngineers : function () {
  	return Engineers.find();
  },
  getAllDams : function () {
    return Dams.find();
  },
  getAllTypes : function () {
    return lodash.uniqBy( 
      Events.find().map(
        function (e) { 
          return { "type" : e.type};
        }), 
      lodash.iteratee("type"));
  },
  getCustomType : function () {
    return Session.get("customType");
  }
})


Template.eventDetails.events({
	"change input[name=title]" : function (event,context) {
		updateEventDetails("title", event.target.value);
	},
	"change select[name=type]" : function (event,context) {
    console.log("change2");
		updateEventDetails("type", event.target.value);
	},
	"change textarea[name=description]" : function (event,context) {
		updateEventDetails("description", event.target.value);

	},
	"change select[name=engineerGoing]" : function (event,context) {

		// TODO this is a terryfying wasy of doign two way binding, find a better one!
    var engineersGoing = $(".ui.form")
      .find('[name="engineerGoing"] option:selected')
      .map(function (e,v) {
        // TODO make a collection of engineers and get by ID!  
        return { id : v.value }; 
      }).get();
    updateEventDetails("engineersGoing", engineersGoing);
	},
	"change select[name=dam]" : function (event,context) {
		updateEventDetails("dam", { id : event.target.value });
	},
	"submit .form" : function (event) {
		if(!$('.ui.form').form('is valid')) { return };
		event.preventDefault();
		Session.set("formValid", true);
	}
})

function updateEventDetails (field, value) {
	var eventL = Session.get("eventDetails");
	eventL[field] = value;
	Session.set("eventDetails", eventL);
}

function formValidations () {
	$('.ui.form').form({
	fields: {
     	title: {
        	identifier: 'title',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'We need a TITLE'
          		}
        	]
      	},
		type: {
        	identifier: 'type',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'We need a TYPE'
          		}
        	]
      	},
		description: {
        	identifier: 'description',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'A few words would do as a DESCRIPTION'
          		}
        	]
      	},
		dam: {
        	identifier: 'dam',
        	rules: [
          		{
            		type   : 'minCount[1]',
            		prompt : 'Need a DAM'
          		}
        	]
      	},
		engineerGoing: {
        	identifier: 'engineerGoing',
        	rules: [
          		{
            		type   : 'minCount[1]',
            		prompt : "Who's going as ENIGNEER"
          		}
        	]
      	}
    }
  });
  $('select.dropdown').dropdown();
}

