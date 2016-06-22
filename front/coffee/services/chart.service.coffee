###
#  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
#
#  Copyright 2016 by Sopra Steria
#  Copyright 2016 by David Peris <david.peris92@gmail.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###
class ChartService

    @.$inject = [
        "$tgHttp",
        "$tgRepo",
        "$translate"
    ]

    constructor: (@http, @repo, @translate) ->


    startDraw: (element, milestone, @settings) ->
        @get_stats_taskpoints(milestone.id)
        .then (stats) =>
            @stats = stats.data
            @redrawChart(element, @stats.days) if @stats


    get_settings: (project_id) ->
        @repo.queryMany("taskpoints_settings", {project: project_id})
        .then (task_points_settings) =>
            settings = {
                project: project_id,
                active: false
            }
            if task_points_settings.length > 0
                settings = task_points_settings[0]


    get_stats_taskpoints: (milestone_id) ->
        @http.get(@repo.resolveUrlForModel(@settings) + '/get_stats_taskpoints?milestone=' + milestone_id)


    redrawChart: (element, dataToDraw) ->
        width = element.width()
        element.height(240)

        days = _.map(dataToDraw, (x) -> moment(x.day))

        data = []
        data.unshift({
            data: _.zip(days, _.map(dataToDraw, (d) -> d.optimal_points))
            lines:
                fillColor : "rgba(120,120,120,0.2)"
        })
        data.unshift({
            data: _.zip(days, _.map(dataToDraw, (d) -> d.open_points))
            lines:
                fillColor : "rgba(102,153,51,0.3)"
        })

        options =
            grid:
                borderWidth: { top: 0, right: 1, left:0, bottom: 0 }
                borderColor: '#ccc'
                hoverable: true
            xaxis:
                tickSize: [1, "day"]
                min: days[0]
                max: _.last(days)
                mode: "time"
                daysNames: days
                axisLabel: @translate.instant("TASKBOARD.CHARTS.XAXIS_LABEL")
                axisLabelUseCanvas: true
                axisLabelFontSizePixels: 12
                axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif'
                axisLabelPadding: 5
            yaxis:
                min: 0
                axisLabel: @translate.instant("TASKBOARD.CHARTS.YAXIS_LABEL")
                axisLabelUseCanvas: true
                axisLabelFontSizePixels: 12
                axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif'
                axisLabelPadding: 5
            series:
                shadowSize: 0
                lines:
                    show: true
                    fill: true
                points:
                    show: true
                    fill: true
                    radius: 4
                    lineWidth: 2
            colors: ["rgba(102,153,51,1)", "rgba(120,120,120,0.2)"]
            tooltip: true
            tooltipOpts:
                content: (label, xval, yval, flotItem) =>
                    formattedDate = moment(xval).format(@translate.instant("TASKBOARD.CHARTS.DATE"))
                    roundedValue = Math.round(yval)

                    if flotItem.seriesIndex == 1
                        return @translate.instant("TASKBOARD.CHARTS.OPTIMAL", {
                            formattedDate: formattedDate,
                            roundedValue: roundedValue
                        })

                    else
                        return @translate.instant("TASKBOARD.CHARTS.REAL", {
                            formattedDate: formattedDate,
                            roundedValue: roundedValue
                        })

        element.empty()
        element.plot(data, options).data("plot")



angular.module('taigaContrib.taskpoints').service("chartService", ChartService)