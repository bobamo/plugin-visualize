define('Backbone.d3', ['Backbone', 'underscore','d3'], function (Backbone, _, d3) {
    Backbone.d3 = {
        PlotView:Backbone.View.extend({
            initialize:function (collection, settings) {
                _.bindAll(this);
                this.collection = collection;
                this.collection.bind('change', this.redraw);
                this.collection.bind('add', this.redraw);
                this.collection.bind('remove', this.redraw);

                this.collection.bind('fetch', this.redraw);
                this.collection.bind('reset', this.draw);

                this.settings = settings || {};
                var divname = this.settings.div || "#plot";
                this.div = d3.select(divname)
                // time taken in transitions
                this.duration = this.settings.duration || 500;
                this.collection.fetch();

                // TODO: make the chart a member var of the View
                // for easier access/fine grained control
            },
            plotdata:function () {
                return this.collection.pluck('value');
            },
            draw:function () {
                // Draw the plot
                var plotdata = this.plotdata();
                if (plotdata.length > 0) {
                    this.plot({
                        newPlot:true
                    }, plotdata);
                    this.caption();
                }
            },
            redraw:function () {
                // transition the plot
                this.plot({
                    newPlot:false
                }, this.plotdata());
            },
            plot:function (opt, plotdata) {
                if (console) {
                    console.log("Not implemented in base class");
                }
                return;
            },
            caption:function () {
                if (this.settings.caption || this.collection.caption) {
                    var caption = this.settings.caption || this.collection.caption;
                    if (typeof Markdown == "object") {
                        try {
                            var converter = Markdown.getSanitizingConverter();
                            caption = converter.makeHtml(caption);
                        } catch (err) {
                            // do nothing
                            var pass = true;
                        }
                        ;
                    }
                    var captiondiv = $('<div/>', {class:"caption", html:caption});
                    $(this.settings.div).append(captiondiv);
                }
            }
        }),
        PlotCollection:Backbone.Collection.extend({
            initialize:function (models, settings) {
                this.settings = settings || {};
                this.plottype = this.settings.plottype || this.plottype || "bar";
                this.caption = this.settings.caption || false;
                if (models) this.reset(models, {silent:true});
            }
        }),
        Canned:{}
    }
    return Backbone;
});