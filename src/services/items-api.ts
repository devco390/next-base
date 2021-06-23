import ContentAPI from 'services/content-api'
import {
  IItemList,
  IAuthor,
  IItem,
  IItemApi,
  IItemListApi,
  IAvailableFilters,
  IAvailableFilterValue,
  IFilters,
  IFilterValue,
  IPathFromRoot
} from 'models/Item'

class ItemsService {
  readonly autor: IAuthor = {
    name: 'Daniel',
    lastname: 'Pérez'
  }

  readonly limitResults: number = 4

  async getItem(itemId: string) {
    const itemData = await ContentAPI.contentAPIMeli
      .get(`/items/${itemId}`)
      .catch(() => {
        return undefined
      })

    if (itemData) {
      const descriptionData = await ContentAPI.contentAPIMeli
        .get(`/items/${itemId}/description`)
        .catch(() => {
          return undefined
        })

      const transformData = {
        ...this.transformDataItem(itemData.data)
      }

      const searchDataByCategory = await ContentAPI.contentAPIMeli.get(
        `/sites/MLA/search`,
        {
          params: {
            category: transformData.category_id,
            limit: 1
          }
        }
      )

      const { data: itemsData }: { data: IItemListApi } = searchDataByCategory

      const categories = this.getCategoriesByItem(itemsData.filters)

      const item = {
        author: this.autor,
        ...transformData,
        description: descriptionData ? descriptionData.data.plain_text : '',
        categories
      }

      return item
    } else {
      return null
    }
  }

  async getItems(q: string): Promise<IItemList> {
    const items = await ContentAPI.contentAPIMeli.get(`/sites/MLA/search`, {
      params: {
        q,
        limit: this.limitResults
      }
    })

    const { data: itemsData }: { data: IItemListApi } = items

    const categories = this.getCategories(itemsData.available_filters)

    const itemsTransformed = itemsData.results.map((item: IItemApi) => {
      return this.transformDataItem(item)
    })

    return {
      author: this.autor,
      categories,
      items: itemsTransformed
    }
  }

  getCategoriesByItem(filters: IFilters[]): string[] {
    const categories = filters.filter((filter) => {
      return filter.id === 'category'
    })

    if (categories.length > 0) {
      const categoriesValues = categories[0].values.map(
        (category: IFilterValue) => {
          return category.path_from_root
        }
      )

      if (categoriesValues.length > 0) {
        const categoriesTranformed = categoriesValues[0].map(
          (category: IPathFromRoot) => {
            return category.name
          }
        )

        return categoriesTranformed.filter((item: string, index: number) => {
          return categoriesTranformed.indexOf(item) === index
        })
      }
    }
    return []
  }
  getCategories(availableFilters: IAvailableFilters[]): string[] {
    const categories = availableFilters.filter((filter) => {
      return filter.id === 'category'
    })

    if (categories.length > 0) {
      return categories[0].values
        .sort((a: IAvailableFilterValue, b: IAvailableFilterValue) => {
          if (b.results > a.results) return 1
          if (a.results > b.results) return -1

          return 0
        })
        .map((category: IAvailableFilterValue) => {
          return category.name
        })
    }
    return []
  }

  transformDataItem(item: IItemApi): IItem {
    return {
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
        decimals: 2
      },
      picture: item.pictures
        ? item.pictures[0].secure_url
        : item.thumbnail.replace('http://', 'https://'),
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      location: item.address ? item.address.state_name : '',
      sold_quantity: item.sold_quantity,
      category_id: item.category_id
    }
  }
}

export default ItemsService
