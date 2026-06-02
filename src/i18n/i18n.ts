import rosetta from "rosetta";

export const i18n = rosetta({
	en: {
		build: {
			error: {
				out: {
					required: "You must enter output directory",
					min: "Cannot handle empty output directory",
				},
			},
		},
	},
	ko: {
		build: {
			error: {
				out: {
					required: "Output directory는 반드시 입력해야 합니다",
					min: "Output directory는 빈 문자열일 수 없습니다",
				},
			},
		},
	},
});
