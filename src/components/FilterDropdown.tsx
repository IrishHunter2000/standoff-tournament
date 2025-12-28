export const FilterDropdown = ({ filterTitle, filterValue, filterOptions, changeFilter }: {
        filterTitle: string, filterValue: string, filterOptions: any, changeFilter: (value: string) => void
    }) => {
    
    return (
        <div className="flex flex-col text-left">
            <label className="text-sm text-gray-700">{filterTitle}</label>
            <select
                className="border p-2 rounded bg-neutral-700"
                value={filterValue}
                onChange={(e) => changeFilter(e.target.value)}
            >
                {filterOptions.map((option: any) => {
                    const displayName = filterTitle === "Teams" ? (option.name + " " + (option.color !== "None" ? "(" + option.color + ")" : "")) : filterTitle === "Players" ? option.first_name + " " + option.last_name : option.name;
                    return (
                        <option key={option.id} value={option.id}>
                            {displayName}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}