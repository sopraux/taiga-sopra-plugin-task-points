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
class TableService

    @.$inject = [
        "$tgRepo"
    ]

    constructor: (@repo) ->

    get_table: (@scope) ->
        @repo.queryMany("roles", {project: @scope.projectId})
        .then (roles_data) =>
            @scope.roles = roles_data

            @repo.queryMany("userstories", {milestone: @scope.selected.id})
        .then (us_data) =>
            @scope.userstories = us_data

            @repo.queryMany("points", {project: @scope.projectId})
        .then (points_data) =>
            points_map = @map_values(points_data)
            total_points = 0
            for userstory, index in @scope.userstories
                points = []
                total_points += userstory.total_points

                for point_key, point_id of userstory.points     # get points of each role in userstory.points
                    points.push({ key: point_key, value: points_map[point_id] })

                for role in @scope.roles       # add missing roles which arent returnt by the taiga api
                    missing_role = true
                    for point in points when role.id.toString() is point.key
                        missing_role = false
                    if missing_role then points.push({ key: role.id.toString(), value: null })

                @scope.userstories[index].points_value = points

            @remove_unused_fields(@scope.userstories, @scope.roles)
            @scope.column_totals = @get_column_total_points(@scope.userstories)
            @scope.total_points  = total_points



        .then null, (data) ->
            return null


    map_values: (array) ->
        map = []
        for row in array
            map[row.id] = row.value
        return map


    remove_unused_fields: (userstories, roles) ->
        points_key = roles.map( (rol) -> rol.id.toString() ) # relation between roles and points

        # splice roles not computable
        for r in [roles.length-1..0] when roles[r]? and not roles[r].computable
            roles.splice(r, 1)

        # splice roles which have not points
        for k in [points_key.length-1..0] when points_key[k]?
            remove_key = false
            for userstory, story_index in userstories
                for point in userstory.points_value when point.key is points_key[k] and point.value? and point.value > 0
                    remove_key = true
            if remove_key
                points_key.splice(k, 1)

        for key in points_key
            for r in [roles.length-1..0] when roles[r]? and roles[r].id is parseInt(key)
                roles.splice(r, 1)
            for userstory, story_index in userstories
                points = userstory.points_value
                for p in [points.length-1..0] when points[p]? and points[p].key is key
                    userstories[story_index].points_value.splice(p, 1)


    get_column_total_points: (userstories) ->
        totals = []
        for point in userstories[0].points_value
            if point.value? then value = point.value
            else value = 0
            totals.push({ key: point.key, value: value })

        if userstories.length > 1
            for u in [1..userstories.length-1]
                for point in userstories[u].points_value
                    for total, t in totals when total.key is point.key and point.value?
                        totals[t].value += point.value
        return totals


    get_present_milestone: (milestones) ->
        today = new Date().getTime()

        for milestone in milestones
            start_date  = @get_formatted_date(milestone.estimated_start).getTime()
            finish_date = @get_formatted_date(milestone.estimated_finish).getTime()

            if start_date <= today and today <= finish_date
                return milestone

        return milestones[0]


    get_formatted_date: (date_string) ->
        date    = date_string.split('-')
        year    = parseInt(date[0])
        month   = parseInt(date[1])-1
        day     = parseInt(date[2])

        return new Date(year, month, day)


angular.module('taigaContrib.taskpoints').service("tableService", TableService)
