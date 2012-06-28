define(['../lib/baseClient'], function(baseClient) {
  var errorHandlers=[], myBaseClient = baseClient.getInstance('documents');
  function fire(eventType, eventObj) {
    if(eventType == 'error') {
      for(var i=0; i<errorHandlers.length; i++) {
        errorHandlers[i](eventObj);
      }
    }
  }
  function getUuid() {
    var uuid = '',
        i,
        random;

    for ( i = 0; i < 32; i++ ) {
        random = Math.random() * 16 | 0;
        if ( i === 8 || i === 12 || i === 16 || i === 20 ) {
            uuid += '-';
        }
        uuid += ( i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random) ).toString( 16 );
    }
    return uuid;
  }
  function getPrivateList(listName) {
    myBaseClient.connect(listName);
    function getIds() {
      var myHashmap= myBaseClient.get(listName+'/'), myArray=[];
      for(var i in myHashmap) {
        myArray.push(i);
      }
      return myArray;
    }
    function getContent(id) {
      var valueStr = myBaseClient.get(listName+'/'+id);
      if(valueStr) {
        try {
          var obj = JSON.parse(valueStr);
          return obj.content;
        } catch(e) {
          fire('error', e);
        }
      }
      return '';
    }
    function getTitle(id) {
      return getContent(id).slice(0, 50);
    }
    function setContent(id, content) {
      if(content == '') {
        myBaseClient.remove(listName+'/'+id);
      } else {
        myBaseClient.storeObject(listName+'/'+id, false, 'documents/text', {
          content: content
        });
      }
    }
    function add(content) {
      var id = getUuid();
      myBaseClient.storeObject(listName+'/'+id, false, 'documents/text', {
        content: content
      });
      return id;
    }
    function on(eventType, cb) {
      myBaseClient.on(eventType, cb);
      if(eventType == 'error') {
        errorHandlers.push(cb);
      }
    }
    return {
      getIds        : getIds,
      getContent    : getContent,
      getTitle      : getTitle,
      setContent    : setContent,
      add           : add,
      on            : on
    };
  }
  return {
    name: 'documents',
    dataVersion: '0.1',
    dataHints: {
      "module": "documents can be text documents, or etherpad-lite documents or pdfs or whatever people consider a (text) document. But spreadsheets and diagrams probably not",
      "objectType text": "a human-readable plain-text document in utf-8. No html or markdown etc, they should have their own object types",
      "string text#content": "the content of the text document",
      
      "directory documents/notes/": "used by litewrite for quick notes",
      "item documents/notes/calendar": "used by docrastinate for the 'calendar' pane",
      "item documents/notes/projects": "used by docrastinate for the 'projects' pane",
      "item documents/notes/personal": "used by docrastinate for the 'personal' pane"
    },
    codeVersion: '0.1.0',
    exports: {
      getPrivateList: getPrivateList
    }
  };
});