import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from 'react'
import {
  createCategory,
  createExpense,
  deleteCategory,
  deleteExpense,
  getCategories,
  getExpenses,
  updateCategory,
  updateExpense,
} from '../lib/api'

const emptyExpenseForm = {
  title: '',
  amount: '',
  category: '',
}

const DashboardPage = ({ token, userEmail, onSessionExpired }) => {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm)
  const [categoryName, setCategoryName] = useState('')
  const [editingExpenseId, setEditingExpenseId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [busyAction, setBusyAction] = useState('')
  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase())

  const handleSessionError = useCallback((error) => {
    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      onSessionExpired()
    }
    setFeedback({ type: 'error', text: error.message })
  }, [onSessionExpired])

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setFeedback({ type: '', text: '' })

    try {
      const [nextExpenses, nextCategories] = await Promise.all([
        getExpenses(token),
        getCategories(token),
      ])

      startTransition(() => {
        setExpenses(nextExpenses)
        setCategories(nextCategories)
      })
    } catch (error) {
      handleSessionError(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleSessionError, token])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const resetExpenseForm = () => {
    setExpenseForm(emptyExpenseForm)
    setEditingExpenseId(null)
  }

  const resetCategoryForm = () => {
    setCategoryName('')
    setEditingCategoryId(null)
  }

  const handleExpenseChange = (event) => {
    const { name, value } = event.target
    setExpenseForm((current) => ({ ...current, [name]: value }))
  }

  const handleExpenseSubmit = async (event) => {
    event.preventDefault()
    setBusyAction('expense')
    setFeedback({ type: '', text: '' })

    try {
      const payload = {
        ...expenseForm,
        amount: Number.parseFloat(expenseForm.amount),
      }

      if (editingExpenseId) {
        await updateExpense(editingExpenseId, payload, token)
        setFeedback({ type: 'success', text: 'Expense updated successfully.' })
      } else {
        await createExpense(payload, token)
        setFeedback({ type: 'success', text: 'Expense added successfully.' })
      }

      resetExpenseForm()
      await loadDashboard()
    } catch (error) {
      handleSessionError(error)
    } finally {
      setBusyAction('')
    }
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setBusyAction('category')
    setFeedback({ type: '', text: '' })

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, { name: categoryName }, token)
        setFeedback({ type: 'success', text: 'Category updated successfully.' })
      } else {
        await createCategory({ name: categoryName }, token)
        setFeedback({ type: 'success', text: 'Category created successfully.' })
      }

      resetCategoryForm()
      await loadDashboard()
    } catch (error) {
      handleSessionError(error)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteExpense = async (id) => {
    setBusyAction(`delete-expense-${id}`)
    setFeedback({ type: '', text: '' })

    try {
      await deleteExpense(id, token)
      setFeedback({ type: 'success', text: 'Expense deleted successfully.' })
      await loadDashboard()
    } catch (error) {
      handleSessionError(error)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteCategory = async (id) => {
    setBusyAction(`delete-category-${id}`)
    setFeedback({ type: '', text: '' })

    try {
      await deleteCategory(id, token)
      setFeedback({ type: 'success', text: 'Category deleted successfully.' })
      await loadDashboard()
    } catch (error) {
      handleSessionError(error)
    } finally {
      setBusyAction('')
    }
  }

  const beginExpenseEdit = (expense) => {
    setEditingExpenseId(expense.id)
    setExpenseForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    })
  }

  const beginCategoryEdit = (category) => {
    setEditingCategoryId(category.id)
    setCategoryName(category.name)
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      !deferredSearch ||
      expense.title.toLowerCase().includes(deferredSearch) ||
      expense.category.toLowerCase().includes(deferredSearch)

    const matchesCategory =
      categoryFilter === 'all' || expense.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number.parseFloat(expense.amount),
    0
  )
  const hasCategories = categories.length > 0

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Your expense command center</h1>
          <p>Logged in as {userEmail || 'current user'}.</p>
        </div>
        <div className="quick-links">
          <button type="button" className="secondary-button" onClick={loadDashboard}>
            Refresh data
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              resetExpenseForm()
              resetCategoryForm()
              setSearchTerm('')
              setCategoryFilter('all')
              setFeedback({ type: '', text: '' })
            }}
          >
            Clear form
          </button>
        </div>
      </div>

      {feedback.text ? (
        <div
          className={`status-banner ${
            feedback.type === 'error' ? 'status-error' : 'status-success'
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="stats-grid">
        <article className="stat-card">
          <p>Total spent</p>
          <h2>${totalSpent.toFixed(2)}</h2>
        </article>
        <article className="stat-card">
          <p>Expense entries</p>
          <h2>{expenses.length}</h2>
        </article>
        <article className="stat-card">
          <p>Categories</p>
          <h2>{categories.length}</h2>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>{editingExpenseId ? 'Edit expense' : 'Add an expense'}</h2>
              <p className="panel-subcopy">
                Record purchases as they happen and keep your spending history up to date.
              </p>
            </div>
          </div>

          <form className="stack" onSubmit={handleExpenseSubmit}>
            <label className="field">
              <span>Title</span>
              <input
                type="text"
                name="title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                placeholder="Groceries, transit, rent..."
                required
              />
            </label>

            <label className="field">
              <span>Amount</span>
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                placeholder="0.00"
                required
              />
            </label>

            <label className="field">
              <span>Category</span>
              <select
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
                disabled={!hasCategories}
                required
              >
                <option value="">
                  {hasCategories ? 'Select a category' : 'Create a category first'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="quick-links">
              <button
                type="submit"
                className="primary-button"
                disabled={busyAction === 'expense' || !hasCategories}
              >
                {!hasCategories
                  ? 'Create category first'
                  : busyAction === 'expense'
                  ? 'Saving...'
                  : editingExpenseId
                    ? 'Update expense'
                    : 'Add expense'}
              </button>
              {editingExpenseId ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={resetExpenseForm}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>{editingCategoryId ? 'Edit category' : 'Manage categories'}</h2>
              <p className="panel-subcopy">
                Keep your spending neatly organized with categories that fit your routine.
              </p>
            </div>
          </div>

          <form className="stack" onSubmit={handleCategorySubmit}>
            <label className="field">
              <span>Category name</span>
              <input
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Food, Bills, School..."
                required
              />
            </label>

            <div className="quick-links">
              <button
                type="submit"
                className="primary-button"
                disabled={busyAction === 'category'}
              >
                {busyAction === 'category'
                  ? 'Saving...'
                  : editingCategoryId
                    ? 'Update category'
                    : 'Add category'}
              </button>
              {editingCategoryId ? (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={resetCategoryForm}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div className="section-block">
            <h3>Saved categories</h3>
            <div className="category-list">
              {categories.length === 0 ? (
                <p className="empty-state">
                  Create your first category so expenses can be classified.
                </p>
              ) : (
                categories.map((category) => (
                  <div className="category-item" key={category.id}>
                    <div className="category-main">
                      <strong>{category.name}</strong>
                      <span className="category-meta">
                        Linked to your logged-in account
                      </span>
                    </div>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="inline-button"
                        onClick={() => beginCategoryEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={busyAction === `delete-category-${category.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      </div>

      <article className="panel section-block">
        <div className="panel-header">
          <div>
            <h2>Expense history</h2>
            <p className="panel-subcopy">
              Search by title or category, then update or remove entries whenever you need.
            </p>
          </div>
        </div>

        <div className="toolbar">
          <label className="field">
            <span>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search expenses"
            />
          </label>
          <label className="field">
            <span>Filter by category</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <p className="empty-state">Loading your dashboard data...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="empty-state">
            No expenses match the current search or filter.
          </p>
        ) : (
          <div className="expense-list">
            {filteredExpenses.map((expense) => (
              <div className="expense-item" key={expense.id}>
                <div className="expense-main">
                  <strong>{expense.title}</strong>
                  <span className="expense-meta">
                    {expense.category} · ${Number.parseFloat(expense.amount).toFixed(2)}
                  </span>
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    className="inline-button"
                    onClick={() => beginExpenseEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDeleteExpense(expense.id)}
                    disabled={busyAction === `delete-expense-${expense.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

export default DashboardPage
