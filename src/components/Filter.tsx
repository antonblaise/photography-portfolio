import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

// blueprint of the filter menu
interface FilterMenu {
    name: string;       // The name of the filter menu
    options: {          // The selections
        id: number;
        name: string;
    }[];
    state: number[];    // The state of the filter menu
}

// blueprint of the component properties (input arguments)
interface FilterProps {
    filters: FilterMenu[];
    onFilterChange: (filterName: string, newState: number[]) => void;   // A function with those input arguments, which return nothing.
}

export default function Filter( { filters, onFilterChange }: FilterProps ) {

    return (
        <div className="flex flex-col md:flex-row items-center justify-center space-y-[5%] md:space-x-[40%] md:space-y-0 py-5 md:p-10">
            {
                filters.map((filter) => (
                    <div key={filter.name} className="flex flex-row items-center">
                        <Listbox key={filter.name} value={filter.state} onChange={(newState) => onFilterChange(filter.name, newState)} multiple>
                            <div className="flex flex-row items-center">
                                <ListboxButton className="flex flex-row items-center">
                                    <span 
                                        className="flex flex-row items-center tracking-widest mx-2 md:mx-5 italic text-xs md:text-lg cursor-pointer hover:scale-120 transition-all ease-out duration-200"
                                    >
                                        <i
                                            className="fi fi-rr-menu-burger w-8 h-4 md:w-12 flex items-center justify-center" 
                                        />
                                        {filter.name}
                                    </span>
                                </ListboxButton>

                            </div>

                            <ListboxOptions
                                anchor="bottom start"
                                className="space-y-2 mt-5"
                            >
                                {
                                    filter.options.map((option) => (
                                        <ListboxOption
                                            key={option.id}
                                            value={option.id}
                                            className="flex justify-between select-none cursor-pointer opacity-60 italic tracking-widest bg-black text-white dark:bg-white dark:text-black p-2 md:p-5 text-xs md:text-sm transition-all ease-out duration-200 md:hover:text-yellow-500 md:hover:text-xl md:hover:opacity-100 data-[selected]:opacity-100 data-[selected]:font-bold data-[selected]:text-yellow-500 md:data-[selected]:text-white md:dark:data-[selected]:text-black"
                                        >
                                            <span>{option.name}</span>
                                        </ListboxOption>
                                    ))
                                }

                            </ListboxOptions>
                        </Listbox>

                        {
                            filter.state.length > 0
                            &&
                            <>
                                <span 
                                    className="mx-2 bg-black text-white select-none dark:bg-white dark:text-black text-xs scale-80 md:scale-100 px-2 py-0.5 rounded-full">
                                    {filter.state.length}
                                </span>
                                <i
                                    className="flex fi fi-sr-cross-circle opacity-50 md:scale-120 hover:scale-150 mx-2 transition-all ease-out duration-200"
                                    onClick={() => onFilterChange(filter.name, [])}
                                />
                            </>
                        }
                    </div>

                    
                ))
            }
        </div>

    )
}