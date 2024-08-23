import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CalculatorIcon from "@/assets/icon-calculator.svg";
import IllustrationEmpty from "@/assets/illustration-empty.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { addCommasToNumber } from "./utils";

const formSchema = z.object({
    mortgage_amount: z
        .string()
        .min(1, { message: "This field is required" })
        .refine((d) => !Number.isNaN(Number(d)))
        .refine((d) => Number(d) > 0),
    term_years: z
        .string()
        .min(1, { message: "This field is required" })
        .refine((d) => !Number.isNaN(Number(d)))
        .refine((d) => Number(d) > 0),
    interest_rate: z
        .string()
        .min(1, { message: "This field is required" })
        .refine((d) => !Number.isNaN(Number(d)))
        .refine((d) => Number(d) > 0),
    mortgage_type: z.string({ message: "This field is required" }),
});

type FormType = z.infer<typeof formSchema>;
type ResultType = {
    type: "repayment" | "interest_only" | string;
    howManyMonth: number;
    monthly: number;
    total: number;
};

export default function App() {
    const [result, setResult] = useState<undefined | ResultType>(undefined);
    return (
        <main className="w-full font-plus_jakarta font-medium min-h-screen bg-c_Slate_100 flex items-center justify-center">
            <div className="md:grid grid-cols-2 flex flex-col w-[54rem] bg-white md:rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
                <Form setResult={setResult} />
                <div className="bg-c_Slate_900 md:rounded-bl-[5rem]">
                    {!result && (
                        <div className="w-full h-full flex py-8 flex-col items-center justify-center gap-4">
                            <img src={IllustrationEmpty} alt="illustration" />
                            <h2 className="text-white text-xl font-bold">
                                Results shown here
                            </h2>
                            <p className="text-c_Slate_300 text-sm text-center px-6">
                                Complete the form and click "calculate
                                repayments" to see what you monthly repayments
                                would be.
                            </p>
                        </div>
                    )}
                    {result && <Result result={result} />}
                </div>
            </div>
        </main>
    );
}

function Result({ result }: { result: ResultType }) {
    return (
        <div className="w-full h-full flex flex-col px-8 py-8 gap-4">
            <h2 className="text-xl text-white font-bold">Your results</h2>
            <p className="text-xs text-c_Slate_300 pb-4">
                Your results are shown below based on the information you
                provided. To adjust the results, edit the form and click
                "calculate repayments" again.
            </p>
            <div className="w-full rounded-lg border-t-4 border-c_Lime bg-[#142430] px-8 py-6">
                <p className="text-c_Slate_300 text-xs">
                    Your monthly repayments
                </p>
                <span className="text-c_Lime text-[3rem] font-bold">
                    £{addCommasToNumber(result.monthly.toFixed(2))}
                </span>
                <div className="w-full border-t-[1px] border-c_Slate_500 mt-4 mb-8"></div>
                <p className="text-c_Slate_300 text-xs">
                    Total you'll repay over the term
                </p>
                <span className="text-white text-xl font-bold leading-10">
                    £{addCommasToNumber(result.total.toFixed(2))}
                </span>
            </div>
        </div>
    );
}

function Form({
    setResult,
}: {
    setResult: React.Dispatch<React.SetStateAction<undefined | ResultType>>;
}) {
    const form = useForm<FormType>({ resolver: zodResolver(formSchema) });
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
    } = form;
    const onSubmit: SubmitHandler<FormType> = (data) => {
        const mortgage_type = data.mortgage_type;
        const howManyMonth = Number(data.term_years) * 12;
        const monthly_rate = (Number(data.interest_rate) / 12) * 0.01;
        const amount = Number(data.mortgage_amount);
        if (mortgage_type === "repayment") {
            const monthly =
                (amount * monthly_rate * (1 + monthly_rate) ** howManyMonth) /
                ((1 + monthly_rate) ** howManyMonth - 1);
            setResult(() => ({
                type: data.mortgage_type,
                howManyMonth,
                monthly,
                total: monthly * howManyMonth,
            }));
        } else if (mortgage_type === "interest_only") {
            const monthly = amount * monthly_rate
            setResult(() => ({
                type: data.mortgage_type,
                howManyMonth,
                monthly,
                total: monthly * howManyMonth,
            }));
        }
    };
    const mortgage_type = watch("mortgage_type");
    return (
        <form
            className="flex flex-col px-10 py-8 gap-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex md:flex-row flex-col md:items-center justify-between">
                <h1 className="font-bold text-c_Slate_900 text-xl">
                    Mortgage Calculator
                </h1>
                <button
                    onMouseDown={() => reset()}
                    className="underline text-c_Slate_700 text-sm w-fit"
                >
                    Clear All
                </button>
            </div>
            <div className="flex flex-col w-full gap-2">
                <label
                    htmlFor="mortgage_amount"
                    className="text-c_Slate_700 text-sm"
                >
                    Mortgage Amount
                </label>
                <div
                    className={`flex rounded-md border-[1px] overflow-hidden group focus-within:border-c_Lime ${
                        errors.mortgage_amount
                            ? "border-c_Red"
                            : "border-c_Slate_500"
                    }`}
                >
                    <div
                        className={`h-full flex items-center justify-center transition group-focus-within:bg-c_Lime py-2 px-3 ${
                            errors.mortgage_amount
                                ? "bg-c_Red"
                                : "bg-c_Slate_100"
                        }`}
                    >
                        <span
                            className={`font-black group-focus-within:text-c_Slate_900 ${
                                errors.mortgage_amount
                                    ? "text-white"
                                    : "text-c_Slate_900"
                            }`}
                        >
                            £
                        </span>
                    </div>
                    <input
                        type="text"
                        id="mortgage_amount"
                        data-testid="mortgage_amount"
                        className="flex-grow cursor-pointer text-sm min-w-0 py-2 px-4 text-c_Slate_900 font-bold outline-none"
                        {...register("mortgage_amount")}
                    />
                </div>
                {errors.mortgage_amount && (
                    <span className="text-xs text-c_Red">
                        {errors.mortgage_amount.message}
                    </span>
                )}
            </div>
            <div className="md:grid flex flex-col grid-cols-2 gap-6">
                <div className="flex flex-col w-full gap-2">
                    <label
                        htmlFor="mortgage_term"
                        data-testid="mortgage_term"
                        className="text-c_Slate_700 text-sm"
                    >
                        Mortgage Term
                    </label>
                    <div
                        className={`flex rounded-md border-[1px] overflow-hidden ${
                            errors.term_years
                                ? "border-c_Red"
                                : "border-c_Slate_500"
                        }`}
                    >
                        <input
                            type="text"
                            id="mortgage_term"
                            className="flex-grow text-sm min-w-0 py-2 px-4 text-c_Slate_900 font-bold outline-none"
                            {...register("term_years")}
                        />
                        <div
                            className={`flex items-center justify-center px-4 ${
                                errors.term_years
                                    ? "bg-c_Red"
                                    : "bg-c_Slate_100"
                            }`}
                        >
                            <span
                                className={`font-bold text-sm ${
                                    errors.term_years
                                        ? "text-white"
                                        : "text-c_Slate_700"
                                }`}
                            >
                                year
                            </span>
                        </div>
                    </div>
                    {errors.term_years && (
                        <span className="text-xs text-c_Red">
                            {errors.term_years.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col w-full gap-2">
                    <label
                        htmlFor="interest_rate"
                        className="text-c_Slate_700 text-sm"
                    >
                        Interest Rate
                    </label>
                    <div
                        className={`flex rounded-md border-[1px] overflow-hidden ${
                            errors.interest_rate
                                ? "border-c_Red"
                                : "border-c_Slate_500"
                        }`}
                    >
                        <input
                            type="text"
                            id="interest_rate"
                            data-testid="interest-rate"
                            className="flex-grow text-sm min-w-0 py-2 px-4 text-c_Slate_900 font-bold outline-none"
                            {...register("interest_rate")}
                        />
                        <div
                            className={`flex items-center justify-center px-4 ${
                                errors.interest_rate
                                    ? "bg-c_Red"
                                    : "bg-c_Slate_100"
                            }`}
                        >
                            <span
                                className={`font-bold text-sm ${
                                    errors.interest_rate
                                        ? "text-white"
                                        : "text-c_Slate_700"
                                }`}
                            >
                                %
                            </span>
                        </div>
                    </div>
                    {errors.interest_rate && (
                        <span className="text-xs text-c_Red">
                            {errors.interest_rate.message}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
                <span className="text-c_Slate_700 text-sm">Mortgage Type</span>
                <label
                    htmlFor="repayment"
                    className={`cursor-pointer flex items-center px-4 gap-3 py-2 border-[1px] transition rounded-md bg-opacity-15 ${
                        mortgage_type === "repayment"
                            ? "border-c_Lime bg-c_Lime"
                            : "border-c_Slate_500  bg-transparent"
                    }`}
                >
                    <input
                        type="radio"
                        id="repayment"
                        data-testid="repayment"
                        value="repayment"
                        className="hidden"
                        {...register("mortgage_type")}
                    />
                    <div
                        className={`rounded-full p-[2px] size-4 border-2 transition ${
                            mortgage_type === "repayment"
                                ? "border-c_Lime"
                                : "border-c_Slate_500"
                        } `}
                    >
                        <div
                            className={`rounded-full w-full h-full transition ${
                                mortgage_type === "repayment"
                                    ? "bg-c_Lime"
                                    : "bg-transparent"
                            }`}
                        ></div>
                    </div>
                    <span className="text-sm font-bold text-c_Slate_900">
                        Repayment
                    </span>
                </label>
                <label
                    htmlFor="interest_only"
                    className={`cursor-pointer flex items-center px-4 gap-3 py-2 border-[1px] transition rounded-md bg-opacity-15 ${
                        mortgage_type === "interest_only"
                            ? "border-c_Lime bg-c_Lime"
                            : "border-c_Slate_500  bg-transparent"
                    }`}
                >
                    <input
                        type="radio"
                        id="interest_only"
                        data-testid="interest_only"
                        value="interest_only"
                        className="hidden"
                        {...register("mortgage_type")}
                    />
                    <div
                        className={`rounded-full p-[2px] size-4 border-2 transition ${
                            mortgage_type === "interest_only"
                                ? "border-c_Lime"
                                : "border-c_Slate_500"
                        } `}
                    >
                        <div
                            className={`rounded-full w-full h-full transition ${
                                mortgage_type === "interest_only"
                                    ? "bg-c_Lime"
                                    : "bg-transparent"
                            }`}
                        ></div>
                    </div>
                    <span className="text-sm font-bold text-c_Slate_900">
                        Interest Only
                    </span>
                </label>
                {errors.mortgage_type && (
                    <span className="text-xs text-c_Red">
                        {errors.mortgage_type.message}
                    </span>
                )}
            </div>
            <button
                type="submit"
                data-testid="form-submit"
                className="flex items-center mt-4 w-fit px-8 rounded-full bg-c_Lime py-3 justify-center gap-2 text-sm"
            >
                <img
                    src={CalculatorIcon}
                    alt="calculator icon"
                    className="size-4"
                />
                <span className="text-c_Slate_900 font-bold">
                    Calculate Repayments
                </span>
            </button>
        </form>
    );
}
