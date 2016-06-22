import datetime

def total_closed_points_by_date(milestone, date, settings):
        # Milestone instance will keep a cache of the total closed points by date
        if milestone._total_closed_points_by_date is None:
            milestone._total_closed_points_by_date = {}

            # We need to keep the milestone user stories indexed by id in a dict
            user_stories = {}
            for us in milestone.cached_user_stories:
                us._total_us_points = sum(milestone._get_user_stories_points([us]).values())
                user_stories[us.id] = us

            tasks = milestone.tasks.\
                    select_related("user_story").\
                    exclude(finished_date__isnull=True).\
                    exclude(user_story__isnull=True)

            # For each finished task we try to know the proporional part of points
            # it represetnts from the user story and add it to the closed points
            # for that date
            # This calulation is the total user story points divided by its number of tasks
            for task in tasks:
                user_story = user_stories[task.user_story.id]
                total_us_points = user_story._total_us_points
                real_points = settings.get_real_points(task)


                # If the task was finished before starting the sprint it needs
                # to be included
                finished_date = task.finished_date.date()
                if finished_date < milestone.estimated_start:
                    finished_date = milestone.estimated_start

                points_by_date = milestone._total_closed_points_by_date.get(finished_date, 0)
                points_by_date += real_points
                milestone._total_closed_points_by_date[finished_date] = points_by_date


            # At this point milestone._total_closed_points_by_date keeps a dict where the
            # finished date of the task is the key and the value is the increment of points
            # We are transforming this dict of increments in an acumulation one including
            # all the dates from the sprint

            acumulated_date_points = 0
            current_date = milestone.estimated_start
            while current_date <= milestone.estimated_finish:
                acumulated_date_points += milestone._total_closed_points_by_date.get(current_date, 0)
                milestone._total_closed_points_by_date[current_date] = acumulated_date_points
                current_date = current_date + datetime.timedelta(days=1)

        return milestone._total_closed_points_by_date.get(date, 0)
