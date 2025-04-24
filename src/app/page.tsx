"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [data, setData] = useState<{ [id: string]: number }>({});
	const [x, setX] = useState(1); // Alterar este valor para mudar o tamanho da base da pirâmide
	const [k, setK] = useState(4);

	function retornarCor(primeira: string, segunda: string) {
		if (primeira === segunda) return primeira;
		return (
			["azul", "vermelho", "roxo"].filter(
				(c) => c !== primeira && c !== segunda
			)[0] || "null"
		);
	}

	function paraTailwind(cor: string) {
		switch (cor) {
			case "azul":
				return "bg-blue-500";
			case "vermelho":
				return "bg-red-500";
			case "roxo":
				return "bg-fuchsia-500";
			default:
				return "bg-gray-500";
		}
	}

	function gerarPiramide(base: string[]): string[][] {
		const piramide: string[][] = [base];
		while (piramide[0].length > 1) {
			const novaLinha: string[] = [];
			for (let i = 0; i < piramide[0].length - 1; i++) {
				novaLinha.push(retornarCor(piramide[0][i], piramide[0][i + 1]));
			}
			piramide.unshift(novaLinha);
		}
		return piramide;
	}

	function gerarFormacoes(x: number): number[][] {
		const resultados: number[][] = [];
		function backtrack(atual: number[]) {
			if (atual.length === x) {
				resultados.push([...atual]);
				return;
			}
			for (let i = 0; i <= 2; i++) {
				atual.push(i);
				backtrack(atual);
				atual.pop();
			}
		}
		backtrack([]);
		return resultados;
	}
	
	useEffect(() => {
		const cores = ["azul", "vermelho", "roxo"];
		const combinacoes = gerarFormacoes(x);
		const novaData: { [id: string]: number } = {};

		combinacoes.forEach((item) => {
			const base = item.map((i) => cores[i]);
			const piramide = gerarPiramide(base);
			const key = `${piramide[piramide.length - 1][0]} + ${piramide[piramide.length - 1][piramide[piramide.length - 1].length - 1]} = ${piramide[0][0]}`;

			novaData[key] = (novaData[key] || 0) + 1;
		});

		setData(novaData);
	}, [x]);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center max-h-[80vh] p-8 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
					<li className="mb-2 tracking-[-.01em]">
						Foram geradas{" "}
						<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded">
							{gerarFormacoes(x).length}
						</code>{" "}
						combinações diferentes.
					</li>
					<li className="tracking-[-.01em]">
						As cores do topo repetiram:
						<pre className="whitespace-pre-wrap bg-black/[.05] dark:bg-white/[.06] p-2 rounded">
							{Object.entries(data)
								.map(([key, value]) => `${key}: ${value}`)
								.join("\n")}
						</pre>
					</li>
				</ol>
				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<button
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
						onClick={() => setX(k)}
					>
						<Image
							className="dark:invert"
							src="/vercel.svg"
							alt="Vercel"
							width={20}
							height={20}
						/>
						Gerar
					</button>
					<input
						className="px-8 py-2 border rounded-lg"
						value={k}
						onChange={(e) => setK(Number(e.target.value))}
					></input>
				</div>
				<div className="w-[80vw] h-[50vh] bg-gray-900 border border-gray-800 overflow-y-auto">
					<ul className="flex flex-wrap">
						{gerarFormacoes(x).map((item, id) => {
							const cores = ["azul", "vermelho", "roxo"];
							const base = item.map((i) => cores[i]);
							const piramide = gerarPiramide(base);

							return (
								<li key={id} className="border m-4">
									<h1>Pirâmide {id}</h1>
									<div className="piramide flex flex-col items-center justify-center">
										{piramide.map((linha, i) => (
											<div
												key={i}
												className={`linha flex justify-center pl-[${
													(piramide.length - i - 1) * 1.5
												}rem]`}
											>
												{linha.map((cor, j) => (
													<div
														key={j}
														className={`${paraTailwind(
															cor
														)} w-6 h-6 rounded-full ml-1`}
													></div>
												))}
											</div>
										))}
									</div>
									<h2>
										{piramide[piramide.length - 1][0]} +{" "}
										{
											piramide[piramide.length - 1][
												piramide[piramide.length - 1].length - 1
											]
										}{" "}
										= {piramide[0][0]}
									</h2>
								</li>
							);
						})}
					</ul>
				</div>
			</main>
		</div>
	);
}
