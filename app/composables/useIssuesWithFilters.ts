import type { UseFetchOptions } from 'nuxt/app'
import type { IssueItem } from '~/data/issues'

interface UseIssuesFiltersOptions {
  status?: string[]
  type?: string[]
  assignee?: string
  dateRange?: { start: Date; end: Date }
}

/**
 * Advanced composable with filtering capabilities
 * Use this when you need more complex query management
 */
export const useIssuesWithFilters = (
  initialFilters?: UseIssuesFiltersOptions, 
  options?: UseFetchOptions<{ data: IssueItem[]; total: number }>
) => {
  // Basic query params
  const queryParams = reactive({
    sortBy: undefined as string | undefined,
    sortDir: 'asc' as 'asc' | 'desc',
    page: 1,
    pageSize: 10,
  })

  // Filter params
  const filters = reactive<UseIssuesFiltersOptions>({
    status: [],
    type: [],
    assignee: undefined,
    dateRange: undefined,
    ...initialFilters
  })

  // Computed query that combines params and filters
  const fullQuery = computed(() => ({
    ...queryParams,
    ...filters,
    // Convert arrays to comma-separated strings for URL
    status: filters.status?.join(',') || undefined,
    type: filters.type?.join(',') || undefined,
  }))

  // Fetch with computed query
  const { data, pending, error, refresh } = useFetch<{ data: IssueItem[]; total: number }>('/api/issues', {
    key: `issues-filtered-${JSON.stringify(fullQuery.value)}`,
    query: fullQuery,
    server: true,
    ...options
  })

  // Filter management functions
  const toggleStatusFilter = (status: string) => {
    const index = filters.status?.indexOf(status) ?? -1
    if (index > -1) {
      filters.status?.splice(index, 1)
    } else {
      filters.status = filters.status || []
      filters.status.push(status)
    }
    queryParams.page = 1 // Reset to first page
  }

  const toggleTypeFilter = (type: string) => {
    const index = filters.type?.indexOf(type) ?? -1
    if (index > -1) {
      filters.type?.splice(index, 1)
    } else {
      filters.type = filters.type || []
      filters.type.push(type)
    }
    queryParams.page = 1
  }

  const setAssigneeFilter = (assignee: string | undefined) => {
    filters.assignee = assignee
    queryParams.page = 1
  }

  const setDateRangeFilter = (dateRange: { start: Date; end: Date } | undefined) => {
    filters.dateRange = dateRange
    queryParams.page = 1
  }

  const clearAllFilters = () => {
    filters.status = []
    filters.type = []
    filters.assignee = undefined
    filters.dateRange = undefined
    queryParams.page = 1
  }

  // Sorting functions
  const updateSort = (sortBy: string, sortDir: 'asc' | 'desc' = 'asc') => {
    queryParams.sortBy = sortBy
    queryParams.sortDir = sortDir
  }

  // Pagination functions
  const updatePage = (page: number) => {
    queryParams.page = page
  }

  const updatePageSize = (pageSize: number) => {
    queryParams.pageSize = pageSize
    queryParams.page = 1
  }

  return {
    // Reactive state
    queryParams: readonly(queryParams),
    filters: readonly(filters),
    data,
    pending,
    error,

    // Filter actions
    toggleStatusFilter,
    toggleTypeFilter,
    setAssigneeFilter,
    setDateRangeFilter,
    clearAllFilters,

    // Sorting & pagination
    updateSort,
    updatePage,
    updatePageSize,
    refresh
  }
}
