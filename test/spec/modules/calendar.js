(function() {
  describe("calendar", function() {
    it("should have the right functions", function() {
      var module = specHelper.getModule('calendar').exports;
      expect(typeof(module.addEvent)).toEqual('function');
      expect(typeof(module.getEventsForDay)).toEqual('function');
      expect(typeof(module.removeEvent)).toEqual('function');
    });
  });
})();
