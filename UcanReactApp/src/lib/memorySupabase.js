/**
 * Minimal in-memory Supabase/PostgREST-style client for integration tests.
 * Supports the query chains used by curriculum + enrollment learner APIs.
 */

function matchesFilters(row, filters) {
  return filters.every(({ type, column, value }) => {
    if (type === "eq") return row[column] === value;
    if (type === "in") return value.includes(row[column]);
    return true;
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

class QueryBuilder {
  constructor(store, table) {
    this.store = store;
    this.table = table;
    this.filters = [];
    this.action = "select";
    this.payload = null;
    this.upsertOpts = null;
    this.selectCols = "*";
    this.singleRow = false;
    this.maybeSingleRow = false;
    this.orderBy = null;
    this.limitN = null;
  }

  select(cols = "*") {
    this.selectCols = cols;
    if (this.action === "from") this.action = "select";
    return this;
  }

  insert(rows) {
    this.action = "insert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  upsert(rows, opts = {}) {
    this.action = "upsert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    this.upsertOpts = opts;
    return this;
  }

  update(values) {
    this.action = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: "eq", column, value });
    return this;
  }

  in(column, values) {
    this.filters.push({ type: "in", column, value: values });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderBy = { column, ascending };
    return this;
  }

  limit(n) {
    this.limitN = n;
    return this;
  }

  single() {
    this.singleRow = true;
    return this.execute();
  }

  maybeSingle() {
    this.maybeSingleRow = true;
    return this.execute();
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    if (!this.store[this.table]) {
      this.store[this.table] = [];
    }
    const table = this.store[this.table];

    if (this.action === "insert") {
      for (const row of this.payload) {
        table.push(clone(row));
      }
      return { data: clone(this.payload), error: null };
    }

    if (this.action === "upsert") {
      const conflict = String(this.upsertOpts?.onConflict || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      for (const row of this.payload) {
        let index = -1;
        if (conflict.length) {
          index = table.findIndex((existing) =>
            conflict.every((key) => existing[key] === row[key])
          );
        } else if (row.id) {
          index = table.findIndex((existing) => existing.id === row.id);
        }

        if (index >= 0) {
          table[index] = { ...table[index], ...clone(row) };
        } else {
          table.push(clone(row));
        }
      }
      return { data: clone(this.payload), error: null };
    }

    if (this.action === "update") {
      const updated = [];
      for (let i = 0; i < table.length; i += 1) {
        if (matchesFilters(table[i], this.filters)) {
          table[i] = { ...table[i], ...clone(this.payload) };
          updated.push(table[i]);
        }
      }
      if (this.singleRow) {
        if (!updated.length) {
          return { data: null, error: { message: "No rows updated" } };
        }
        return { data: clone(updated[0]), error: null };
      }
      return { data: clone(updated), error: null };
    }

    if (this.action === "delete") {
      const kept = [];
      const removed = [];
      for (const row of table) {
        if (matchesFilters(row, this.filters)) {
          removed.push(row);
        } else {
          kept.push(row);
        }
      }
      this.store[this.table] = kept;
      return { data: clone(removed), error: null };
    }

    // select
    let rows = table.filter((row) => matchesFilters(row, this.filters));
    if (this.orderBy) {
      const { column, ascending } = this.orderBy;
      rows = [...rows].sort((a, b) => {
        const left = a[column];
        const right = b[column];
        if (left === right) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return ascending ? (left > right ? 1 : -1) : left < right ? 1 : -1;
      });
    }
    if (this.limitN != null) {
      rows = rows.slice(0, this.limitN);
    }

    if (this.singleRow) {
      if (!rows.length) {
        return { data: null, error: { message: "No rows" } };
      }
      return { data: clone(rows[0]), error: null };
    }
    if (this.maybeSingleRow) {
      return { data: rows[0] ? clone(rows[0]) : null, error: null };
    }
    return { data: clone(rows), error: null };
  }
}

export function createMemorySupabase(seed = {}) {
  const store = {
    learning_courses: [],
    course_sections: [],
    course_lessons: [],
    lecture_resources: [],
    course_enrollments: [],
    lesson_progress: [],
    ...clone(seed),
  };

  return {
    store,
    from(table) {
      return new QueryBuilder(store, table);
    },
    rpc() {
      return Promise.resolve({ data: null, error: null });
    },
  };
}
