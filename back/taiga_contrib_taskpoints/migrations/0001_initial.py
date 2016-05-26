# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-05-25 13:42
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0040_remove_memberships_of_cancelled_users_acounts'),
        ('tasks', '0009_auto_20151104_1131'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskPoints',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estimated_points', models.FloatField(blank=True, default=0.0, verbose_name='estimated points')),
                ('real_points', models.FloatField(blank=True, default=0.0, verbose_name='real points')),
                ('task_type', models.TextField(blank=True, default='', null=True, verbose_name='task type')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_points', to='tasks.Task')),
            ],
        ),
        migrations.CreateModel(
            name='TaskPointsSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=False, verbose_name='check plugin activation')),
                ('ep_name', models.TextField(default='Estimated Points', verbose_name='estimated points name')),
                ('rp_name', models.TextField(default='Real Points', verbose_name='real points name')),
                ('tt_name', models.TextField(default='Type', verbose_name='task type name')),
                ('ep_index', models.IntegerField(blank=True, verbose_name='estimated points index')),
                ('rp_index', models.IntegerField(blank=True, verbose_name='real points index')),
                ('tt_index', models.IntegerField(blank=True, verbose_name='task type index')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_points_settings', to='projects.Project')),
            ],
        ),
    ]
