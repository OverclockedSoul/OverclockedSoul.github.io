---
layout: page
title: Relatos
permalink: /relatos/
---

<div class="posts">
  {% for post in site.categories.relatos %}
    <article class="post">
      {% if post.image %}
        <div class="post-image">
          <a href="{{ post.url }}">
            <img src="{{ post.image | prepend: site.baseurl }}" alt="{{ post.title }}">
          </a>
        </div>
      {% endif %}
      <h2 class="post-title">
        <a href="{{ post.url }}">{{ post.title }}</a>
      </h2>
      <div class="post-date">{{ post.date | date: "%B %-d, %Y" }}</div>
      <div class="post-excerpt">
        {{ post.excerpt }}
      </div>
      <a href="{{ post.url }}" class="read-more">Read More</a>
    </article>
  {% endfor %}
</div>