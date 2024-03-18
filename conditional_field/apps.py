# Copyright (C) 2023, Good Advice IT - All Rights Reserved
# Unauthorized copying and/or editing of this file, via any medium is strictly prohibited
#
# Proprietary, but not confidential
#
# Written by Nigel van Keulen <nigel@goodadvice.it>, November 2023

from django.apps import AppConfig

class ConditionalFieldConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'conditional_field'
