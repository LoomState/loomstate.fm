module Jekyll
  module CollectionFilter

    def select_person(slug, data = nil)
      select_collection('people', slug, data)
    end

    def select_people(slugs, data = nil)
      slugs.map { |e| select_person(e, data) }
    end

    def select_show(slug, data = nil)
      select_collection('shows', slug, data)
    end

    def select_collection(label, slug, data = nil, field = 'slug')
      item = select(label, slug, field)
      data && item ? item.data[data] : item
    end

    def cover_image(item)

      # Item has cover_image
      return item['cover_image'] if !!item['cover_image']

      # Else is it an episode
      return cover_image(select('shows', item['show'])) if !!item['show']

      # Else fall back
      config['url'] + '/' + item['slug'] + '/' + 'cover.jpg'
    end

    private

    def config
      @context.registers[:site].config
    end

    def collection(label)
      @context.registers[:site].collections[label].docs
    end

    def select(label, predicate, field = 'slug')
      collection(label).select { |item| item.data[field] == predicate }.first
    end
  end
end

Liquid::Template.register_filter(Jekyll::CollectionFilter)
