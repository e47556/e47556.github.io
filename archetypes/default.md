---
date: '{{ .Date }}'
draft: false
title: '{{ replace .File.ContentBaseName "_" " " | title }}'
resources:
- name: "featured-image"
  src: "cover.webp"
tags: []
---