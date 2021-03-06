# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-05-26 07:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taiga_contrib_taskpoints', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskpointssettings',
            name='ep_index',
            field=models.IntegerField(blank=True, null=True, verbose_name='estimated points index'),
        ),
        migrations.AlterField(
            model_name='taskpointssettings',
            name='rp_index',
            field=models.IntegerField(blank=True, null=True, verbose_name='real points index'),
        ),
        migrations.AlterField(
            model_name='taskpointssettings',
            name='tt_index',
            field=models.IntegerField(blank=True, null=True, verbose_name='task type index'),
        ),
    ]
